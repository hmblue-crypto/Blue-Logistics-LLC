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

## Owner feedback: approved foundation, continue refining (November 10, 2026)
The owner confirmed the redesigned Blue Logistics public site, including the photo-led homepage, coordinated service-page styling and upgraded Carrier Hub, **looks good** and should remain the approved visual baseline. The owner also explicitly wants further improvements over time. Preserve the overall dark navy/cobalt/cyan brand, prominent trucking imagery, visible desktop navigation, realistic service detail and clear quote/profile CTAs. Prioritize incremental refinement rather than replacing the approved design: improve mobile responsiveness and legibility, authentic photography and image loading, whitespace and information density, page-specific value propositions, accessibility, load performance, live form reliability, and consistent navigation. Do not introduce fabricated testimonials, unsupported claims, or jeopardize working quote, carrier-intake, or portal systems. Keep the homepage's approved look and iterate carefully.

## Resources page visual rule — approved November 10–11, 2026

All public Blue Logistics pages must use relevant, high-quality, non-repetitive visual content. Resource cards must have unique, subject-specific photographs. Preserve the approved navy/cobalt design system, visible desktop navigation, responsive layouts, and functional customer tools. Continue improving existing designs rather than rebuilding working pages.

The owner approved an image showing a compact cinematic Freight Resources banner and a 3-column gallery of **different** images. The page implementation is `resources.html` plus `resources-redesign.css`. Preserve the already approved `index.html`, carrier intake, customer portal, and quote logic. Desktop / tablet / mobile cards must use 3 / 2 / 1 columns. Cards should have accessible descriptions, lazy-loaded 480/800/1200px responsive images, distinct alt text and clear working destinations.

Original resource destinations were preserved: Smart Freight Tools → `freight-tools.html`; Freight Quote Checklist → `freight-quote-checklist.html`; BOL Checklist → `bol-checklist.html`. The other four former non-linked resource cards now link to substantive in-page quick reference guides anchored at `#guide-equipment`, `#guide-ltl`, `#guide-accessorial` and `#guide-import` respectively. Update these guides carefully rather than using placeholder routes.

### Resources image provenance and licensing
The images are Pexels contributors' photos and are used under [Pexels' license](https://www.pexels.com/license/) (commercial website use allowed without required attribution). Use these source image pages to review/relicense if needed; do not claim they depict Blue Logistics personnel, equipment or software. The current implementation uses responsive `images.pexels.com` URLs rather than storing the image binaries in the repository. Verify external CDN availability as part of future QA.

| Resource | Pexels photo ID | Photo source | What the photo actually depicts |
|---|---:|---|---|
| Smart Freight Tools | 12969403 | https://www.pexels.com/photo/close-up-shot-of-a-laptop-computer-12969403/ | Laptop analytics dashboard (illustrative; not Blue Logistics software) |
| Freight Quote Checklist | 6169136 | https://www.pexels.com/photo/person-writing-down-on-a-document-6169136/ | Shipment paperwork and clipboard |
| Bill of Lading Checklist | 6169133 | https://www.pexels.com/photo/close-up-photo-of-documents-on-a-clipboard-6169133/ | Delivery paperwork on clipboard |
| Equipment Guide | 27099094 | https://www.pexels.com/photo/view-of-parked-trucks-27099094/ | Parked refrigerated trailers |
| LTL Basics | 34585120 | https://www.pexels.com/photo/forklift-operators-loading-pallets-on-truck-34585120/ | Pallet handling/loading |
| Accessorial Glossary | 4487382 | https://www.pexels.com/photo/worker-on-a-construction-4487382/ | Pallet jack operator |
| Import Handoff Guide | 1544372 | https://www.pexels.com/photo/blue-and-red-cargo-ship-with-crane-1544372/ | Marine cargo equipment |

Keep all seven resource photographs unique. Avoid invented statistics, customer endorsements or false claims that generic stock assets are our own company vehicles. Replace any photograph if the CDN stops serving it or if the subject does not match its use.

The Resources banner uses the Pexels photograph `37753989` (Laszlo Magyar; https://www.pexels.com/photo/blue-semi-truck-on-a-scenic-mountain-highway-37753989/) rather than a photo that prominently displays another carrier's wordmark. Treat it as illustrative stock photography, not a Blue Logistics truck.
