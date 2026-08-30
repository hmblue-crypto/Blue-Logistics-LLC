import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const allowedOrigins = new Set(["https://www.shipbluelogistics.com", "https://shipbluelogistics.com"]);
const allowedFileTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);
const maxFiles = 3;
const maxFileBytes = 10 * 1024 * 1024;

function cors(origin: string | null) {
  const allow = origin && allowedOrigins.has(origin) ? origin : "https://www.shipbluelogistics.com";
  return { "Access-Control-Allow-Origin": allow, "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", Vary: "Origin", "Content-Type": "application/json", "Cache-Control": "no-store" };
}

function clean(v: unknown, max = 500) { return String(v ?? "").trim().slice(0, max); }
function bool(v: unknown) { return v === true || v === "true" || v === "on" || v === "1"; }
function phoneE164(v: unknown) { const digits = clean(v, 40).replace(/\D/g, ""); return digits.length === 10 ? `+1${digits}` : digits.length >= 11 && digits.length <= 15 ? `+${digits}` : ""; }
function safeFileName(name: string) { return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(-120) || "document"; }

async function hash(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function checkRateLimit(admin: any, req: Request) {
  const ip = clean(req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("cf-connecting-ip") || "unknown", 100);
  const key = await hash(`public-quote:${ip}`);
  const now = new Date();
  const { data } = await admin.from("quote_intake_rate_limits").select("request_count,window_started_at").eq("endpoint_key", key).maybeSingle();
  if (!data || now.getTime() - new Date(data.window_started_at).getTime() >= 60 * 60 * 1000) {
    await admin.from("quote_intake_rate_limits").upsert({ endpoint_key: key, request_count: 1, window_started_at: now.toISOString(), updated_at: now.toISOString() });
    return true;
  }
  if (Number(data.request_count) >= 10) return false;
  await admin.from("quote_intake_rate_limits").update({ request_count: Number(data.request_count) + 1, updated_at: now.toISOString() }).eq("endpoint_key", key);
  return true;
}

async function parseRequest(req: Request) {
  if ((req.headers.get("content-type") || "").includes("multipart/form-data")) {
    const form = await req.formData();
    const body: Record<string, unknown> = {};
    for (const [key, value] of form.entries()) if (!(value instanceof File)) body[key] = value;
    const files = form.getAll("attachments").filter((value): value is File => value instanceof File && value.size > 0);
    return { body, files };
  }
  return { body: await req.json(), files: [] as File[] };
}

async function sendOwnerPush(admin: any, quote: any) {
  try {
    const [{ data: owners }, { data: cfg }] = await Promise.all([
      admin.from("team_members").select("auth_user_id,name,role").in("role", ["Owner", "Manager"]).not("auth_user_id", "is", null),
      admin.from("mobile_push_config").select("vapid_public_key,vapid_private_key,subject").eq("id", 1).single(),
    ]);
    if (!cfg || !owners?.length) return { sent: 0 };
    const ownerIds = owners.map((o: any) => o.auth_user_id).filter(Boolean);
    const { data: subs } = await admin.from("mobile_push_subscriptions").select("id,auth_user_id,endpoint,p256dh,auth_secret").in("auth_user_id", ownerIds).eq("enabled", true);
    if (!subs?.length) return { sent: 0 };
    webpush.setVapidDetails(cfg.subject, cfg.vapid_public_key, cfg.vapid_private_key);
    const company = quote.company || `${quote.first_name || ""} ${quote.last_name || ""}`.trim() || "New shipper";
    const payload = JSON.stringify({ title: quote.urgency === "Urgent" ? "🔥 URGENT WEBSITE QUOTE" : "💰 New Website Quote", body: `${company} · ${quote.service} · ${quote.pickup_location} → ${quote.delivery_location}`.slice(0, 220), url: "/quote-inbox", tag: `website-quote-${quote.id}`, icon: "/blue-logistics-logo.png", badge: "/blue-logistics-logo.png" });
    const expired: string[] = []; let sent = 0;
    for (const sub of subs) {
      try { await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_secret } }, payload, { TTL: 300, urgency: "high" }); sent++; }
      catch (err: any) { const code = Number(err?.statusCode || 0); if (code === 404 || code === 410) expired.push(sub.id); }
    }
    if (expired.length) await admin.from("mobile_push_subscriptions").update({ enabled: false, updated_at: new Date().toISOString() }).in("id", expired);
    return { sent };
  } catch (err) { console.error("website quote push failed", err); return { sent: 0 }; }
}

async function sendCustomerSms(quote: any) {
  if (!quote.sms_opt_in) return "skipped";
  const to = phoneE164(quote.phone); if (!to) return "invalid_phone";
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID"), token = Deno.env.get("TWILIO_AUTH_TOKEN"), from = Deno.env.get("TWILIO_FROM_NUMBER");
  if (!sid || !token || !from) return "not_configured";
  try {
    const ref = String(quote.id).slice(0, 8).toUpperCase();
    const body = new URLSearchParams({ To: to, From: from, Body: `Blue Logistics received quote request ${ref} for ${quote.pickup_location} to ${quote.delivery_location}. This requests a quote only and does not book freight. Reply STOP to opt out.` });
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, { method: "POST", headers: { Authorization: `Basic ${btoa(`${sid}:${token}`)}`, "Content-Type": "application/x-www-form-urlencoded" }, body });
    return response.ok ? "sent" : "failed";
  } catch (err) { console.error("customer quote sms failed", err); return "failed"; }
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: cors(origin) });
  if (origin && !allowedOrigins.has(origin)) return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403, headers: cors(origin) });

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  try {
    if (!(await checkRateLimit(admin, req))) return new Response(JSON.stringify({ error: "Too many quote attempts. Please wait and try again." }), { status: 429, headers: cors(origin) });
    const { body, files } = await parseRequest(req);
    const email = clean(body.email, 200).toLowerCase(), pickup = clean(body.pickup_location, 300), delivery = clean(body.delivery_location, 300), service = clean(body.service, 80), firstName = clean(body.first_name, 120), lastName = clean(body.last_name, 120);
    if (!email || !email.includes("@") || !pickup || !delivery || !service || !firstName || !lastName) return new Response(JSON.stringify({ error: "Please complete name, email, pickup, delivery, and service." }), { status: 400, headers: cors(origin) });
    if (files.length > maxFiles) return new Response(JSON.stringify({ error: `Please attach no more than ${maxFiles} files.` }), { status: 400, headers: cors(origin) });
    for (const file of files) if (!allowedFileTypes.has(file.type) || file.size > maxFileBytes) return new Response(JSON.stringify({ error: "Attachments must be PDF, JPG, PNG, WEBP, DOC, or DOCX and 10 MB or less each." }), { status: 400, headers: cors(origin) });

    const details = clean(body.shipment_details, 3000), weight = clean(body.weight, 100), commodity = clean(body.commodity, 300), equipment = clean(body.equipment_type, 120);
    const palletCount = Number.isFinite(Number(body.pallet_count)) ? Math.max(0, Math.min(9999, Number(body.pallet_count))) : null;
    let readiness = 35; if (clean(body.company, 200)) readiness += 10; if (clean(body.phone, 80)) readiness += 5; if (body.pickup_date) readiness += 10; if (commodity) readiness += 10; if (weight) readiness += 10; if (palletCount) readiness += 5; if (equipment) readiness += 10; if (details.length > 30) readiness += 5; readiness = Math.min(100, readiness);
    const urgent = /\b(today|tomorrow|asap|urgent|hot|immediately|same day)\b/.test(`${service} ${details} ${body.pickup_date ?? ""}`.toLowerCase());
    const utmSource = clean(body.utm_source, 120), referrer = clean(body.referrer, 500);
    const sourceDetail = clean(body.source_detail, 120) || utmSource || (referrer.includes("google") ? "google" : referrer.includes("instagram") ? "instagram" : referrer.includes("linkedin") ? "linkedin" : referrer.includes("facebook") ? "facebook" : referrer ? "referral" : "direct");
    const record = { first_name: firstName, last_name: lastName, company: clean(body.company, 220), email, phone: clean(body.phone, 80), pickup_location: pickup, delivery_location: delivery, service, pickup_date: body.pickup_date || null, commodity, weight, pallet_count: palletCount, equipment_type: equipment, shipment_details: details, urgency: urgent ? "Urgent" : "Normal", readiness_score: readiness, source: "website", source_detail: sourceDetail, utm_source: utmSource, utm_medium: clean(body.utm_medium, 120), utm_campaign: clean(body.utm_campaign, 200), utm_content: clean(body.utm_content, 200), utm_term: clean(body.utm_term, 200), gclid: clean(body.gclid, 300), fbclid: clean(body.fbclid, 300), landing_page: clean(body.landing_page, 500), referrer, repeat_request: bool(body.repeat_request), sms_opt_in: bool(body.sms_opt_in), sms_status: "skipped", attachment_count: 0 };
    const { data, error } = await admin.from("public_quote_requests").insert(record).select("*").single(); if (error) throw error;

    const uploaded: string[] = [];
    try {
      const metadata: any[] = [];
      for (const file of files) {
        const path = `${data.id}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
        const { error: uploadError } = await admin.storage.from("quote-documents").upload(path, file, { contentType: file.type, upsert: false });
        if (uploadError) throw uploadError; uploaded.push(path);
        metadata.push({ request_id: data.id, storage_path: path, original_name: clean(file.name, 255), mime_type: file.type, size_bytes: file.size });
      }
      if (metadata.length) { const { error: metaError } = await admin.from("quote_request_attachments").insert(metadata); if (metaError) throw metaError; await admin.from("public_quote_requests").update({ attachment_count: metadata.length }).eq("id", data.id); }
    } catch (uploadError) {
      if (uploaded.length) await admin.storage.from("quote-documents").remove(uploaded);
      await admin.from("public_quote_requests").delete().eq("id", data.id);
      throw uploadError;
    }

    const smsStatus = await sendCustomerSms({ ...data, sms_opt_in: record.sms_opt_in });
    await admin.from("public_quote_requests").update({ sms_status: smsStatus }).eq("id", data.id);
    const push = await sendOwnerPush(admin, data);
    return new Response(JSON.stringify({ ok: true, request_id: data.id, readiness_score: data.readiness_score, urgency: data.urgency, push_sent: push.sent, attachment_count: files.length, sms_status: smsStatus, source_detail: sourceDetail }), { status: 200, headers: cors(origin) });
  } catch (e) {
    console.error("public quote intake failed", e);
    return new Response(JSON.stringify({ error: "We couldn't submit your quote request. Please try again or email hmblue@bluelogisticsllc.us." }), { status: 500, headers: cors(origin) });
  }
});
