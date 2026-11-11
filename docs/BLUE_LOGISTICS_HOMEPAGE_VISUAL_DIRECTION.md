# BLUE LOGISTICS — APPROVED HOMEPAGE VISUAL DIRECTION (2026-11-10)

## Status
The owner explicitly approved the generated full-width desktop website mockup (1536 × 1024) and said “I like that format … execute it fully so it looks exactly like the picture!” Use this specification to preserve the look in future edits. The full reference image was generated in the ChatGPT conversation on November 10, 2026 and can be supplied again if needed; it is not automatically available as a repository asset.

## Brand treatment
- Navy #061c39, deeper navy #03152e, cobalt #006fff, electric cyan #56b8ff, white. Sans-serif heavy headlines, crisp high contrast.
- Keep the official Blue Logistics LLC logo and existing email/phone/contact links. Navigation remains a compact white bar with a cobalt quote CTA.
- Cinematic full-width truck/road photograph behind the hero, dark gradient for text readability.
- Strong hero headline: “Your freight moves forward. We stay with it.” and 4 compact service highlights with white line icons and concise explanations.
- High-contrast 3-step quote wizard in a white card on the right, with blue top border, clear progression and minimal required fields.
- Immediate horizontal industry gallery: title at left + six image-backed cards (manufacturing, food & beverage, construction/materials, distribution/retail, imports, plastics/industrial products).
- Navy ‘Why Choose Blue Logistics?’ strip with 5 trust/benefit items.
- White ‘How It Works’ strip with four steps and an honest service note. Do not fabricate testimonials, customer counts, ratings or performance claims.
- Navy call-to-action strip with subtle American flag imagery and primary quote + telephone buttons.
- Preserve all existing longer informational page sections below the highlighted upper-page reference sections; keep clear links to services, credentials, founders, tools, portal and FAQs.

## Engineering constraints
- Keep existing quote form fields, IDs, handlers, submission behavior, draft memory, upload and confirmation features working (site.js, conversion-engine.js and related scripts).
- No invented business guarantees, quote response times, carrier fleet ownership, or fake testimonials; Blue Logistics is a veteran-owned brokerage, not necessarily an asset carrier.
- Responsive mobile layouts are required; turn six-card industry row into swipeable cards, stack the hero and quote card, retain accessible form labels.
- Scoped overrides live in home-reference.css, loaded after existing CSS; do not rebuild the website or CRM.
- Current visual photo assets are linked from Pexels / Unsplash free-license images and must remain available; replace with licensed company-controlled images if remote hosting stops working or if branding needs to appear on the trailer.

## Design-image location
The original conversation image was stored by ChatGPT as `a_detailed_high_contrast_polished_website_homepa.png`. The file path is conversation-specific, so ask for the file instead of inventing a future sandbox location. This markdown reference is the durable, repository-level design brief.

## Image source references
Hero: https://www.pexels.com/photo/a-blue-semi-truck-driving-down-a-desert-road-27508769/
Manufacturing: https://www.pexels.com/photo/industrial-robot-arm-in-a-manufacturing-facility-34207359/
Food/beverage: https://unsplash.com/s/photos/beverage-factory
Construction: https://unsplash.com/photos/a-wooden-structure-under-construction-under-a-blue-sky-QtF2v8BP46I
Distribution: https://unsplash.com/s/photos/warehouse-building
Imports: https://www.pexels.com/photo/blue-and-red-cargo-ship-with-crane-1544372/
Plastics: https://www.pexels.com/photo/man-inspecting-rolls-of-colorful-vinyl-in-warehouse-36766860/
Flag: https://unsplash.com/photos/an-american-flag-waving-in-the-wind-ln0kPw8UdUI

## Public interior pages — approved site-wide design standard (November 10, 2026)
The owner requested that the homepage's photo-led navy/cobalt design be applied consistently to **every public tab except Home**. The canonical implementation is `interior-reference.css` and the `interior-reference interior-*` body classes on the public pages. Use a compact white/navy header, cinematic freight or industry hero, clear page-specific sales message, photo cards, four service/trust capabilities, a prominent quote/contact action, and mobile-friendly layout. Keep freight, industries, carriers, resources, contact, founders, tools, checklists and customer portal visually aligned with the homepage. Never replace quote intake, portal auth, shipment data, carrier compliance, printing or calculators with nonfunctional mockups. Do not claim owned trucks, invented results, or fictional testimonials. Preserve approved homepage `index.html` and private owner operation apps `owner-os6.html`/`owner-os7.html` without changes. New public pages should also link to the shared interior design sheet. This rule was explicitly approved in the ChatGPT conversation and retained here for future developers.

## Carrier Hub refinement — November 10, 2026 evening
The owner reviewed the live Carrier Hub screenshot and requested the workflow area be visually richer and **that the top website navigation tabs remain visible at laptop/desktop widths** (the earlier 1180px breakpoint hid the whole navigation at about 1125px). The approved direction is a truck-photo hero, compact on-page Carrier Hub section shortcuts, four illustrated deep-navy workflow cards, photo-backed carrier capability cards, and a strong but compliance-honest carrier-profile form. The implementation lives in `carrier-hub-2026.css` and `carriers.html`.

All interior public pages should show a compact consistent main navigation above 1020px: Home, Services dropdown (Domestic, Import / Export, Warehousing, Nationwide), Industries, Carriers, Resources, About, Track / Portal, Get a Quote. The responsive breakpoint is in `interior-reference.css` and `site.js`. Keep the approved homepage layout unchanged, preserve quote intake, carrier verification, and customer portal interactions. Do not imply carriers are preapproved, freight is guaranteed, or the brokerage owns an asset fleet.
