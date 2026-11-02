# Website quote alerts — activation checklist

Owner destination: `hmblue@shipbluelogistics.com`.

The production Supabase Edge Function `public-quote-intake` currently stores website quotes and sends optional SMS / push, but has no owner email alert. This change adds a **private outbox** and a Resend notification immediately after a saved quote, without affecting customer success when email is unavailable.

## Activation sequence

1. Resolve the existing **Resend domain verification failure** for `shipbluelogistics.com`. Resend currently reports failed DKIM, SPF and bounce/return-path records. Confirm the DNS records through the connected Resend domain details. Avoid overwriting existing business MX records.
2. Verify the sending domain is ready and existing outbound transactional mail works.
3. Add `RESEND_API_KEY` to the **Supabase Edge Function secrets**, not the public website's browser bundle or the source repository. Optionally set `QUOTE_ALERT_FROM` to a verified sender on the same domain.
4. Apply `supabase/migrations/20261102_quote_owner_email_notifications.sql` and confirm RLS/grants keep it inaccessible to public clients.
5. Deploy only the reviewed source of `supabase/functions/public-quote-intake/index.ts` as `public-quote-intake` with `verify_jwt=false`, matching the current public form. It has Origin checks and rate-limiting; preserve both.
6. Controlled test: submit a synthetic quote via an authorized preview/test procedure, verify its CRM ID, one outbox row, one Resend provider message, inbox arrival, original form response and push/SMS unchanged. Do not send mock freight data to production without approval.
7. Add an authenticated retry worker with backoff, idempotency and max attempts for `pending` or `failed` rows, plus delivery-webhook verification before claiming `delivered`. **Current patch does not implement scheduled retries** and should not be described as fully reliable until added.

## Expected email fields

Customer, company, email, phone, origin, destination, requested pickup date, service, commodity, weight, pallets, equipment, urgency, notes, received time, reference and authenticated CRM link.

## Status semantics

- `pending`: queued but no provider outcome yet
- `failed`: provider rejected or request errored; quote remains stored
- `accepted`: Resend returned a message identifier, **not** confirmed inbox delivery
- `delivered`: reserved for a future verified webhook; not assigned by current code

This implementation has **not yet been deployed or end-to-end tested**. Domain verification and API credentials are outstanding.
