# David & Shriya Wedding Website

## Couple
- **Groom**: David Taylor Gonzalez, MD
- **Bride**: Shriya Airen, MD
- **Both are physicians**
- **Wedding Date**: TBD
- **Hashtag**: #DavidAndShriya
- **Domain**: davidandshriya.com (purchased via Netlify)

## Hosting & Deployment
- **Host**: Netlify (free tier)
- **Repo**: https://github.com/eyeboi/davidandshriya-wedding
- **Deploy**: Auto-deploys on `git push origin main`
- **Domain**: Purchased through Netlify, DNS/SSL auto-configured
- **No build step** — static HTML/CSS/JS served directly

## Tech Stack
- Plain HTML, CSS, JavaScript — no frameworks
- Fonts: Cormorant (display) + Libre Franklin (body) + Noto Serif Devanagari (Hindi) via Google Fonts
- Color palette derived from proposal photos (sunset golds, lavender sky, ocean teal, coral, warm sand)
- Floating particle canvas, film grain overlay, cursor glow effect
- Scroll-triggered reveal animations with staggered timing

## File Structure
```
index.html          — Main wedding site (single page)
rsvp.html           — Dedicated multi-step RSVP form page
css/style.css       — Main site styles
css/rsvp.css        — RSVP page-specific styles
js/main.js          — Main site JS (particles, scroll reveals, nav)
js/rsvp.js          — RSVP multi-step form logic
images/             — All photos and SVGs
  hero.jpeg         — Proposal wide shot (IMG_0154) — portrait 3:5
  shriya.jpeg       — Shriya golden hour (IMG_0337) — portrait 3:5
  david.jpeg        — David with ring (IMG_0347) — portrait 3:5
  couple-lift.jpeg  — Both together by ocean (IMG_0501) — portrait 3:5
  proposal.jpeg     — On one knee (IMG_0313) — landscape 3:2
  celebration.jpeg  — Celebrating together (IMG_0205) — landscape 3:2
  ring-detail.jpeg  — Ring closeup (IMG_0224) — portrait 3:5
  ring-hands.jpeg   — Hands with ring (IMG_0412) — landscape 3:2
  golden-hour.jpeg  — Shriya full-body sunset (IMG_0334) — portrait 3:5
  together.jpeg     — Looking out at ocean (IMG_0415) — portrait 3:5
  favicon.svg       — D&S text favicon
  mandala.svg       — Decorative mandala (unused currently)
```

## Photo Source
Original photos are in:
`/Users/davidtaylor/Library/Mobile Documents/com~apple~CloudDocs/Documents/Medical Research & Publications/Ophthalmology/Operation Sunrise/Faves Exported/`

Most photos are portrait (3456x5184). When placing in landscape containers, always set `object-position` to keep subjects visible.

## RSVP Form
- 4-step multi-step form: Basics → Events & Logistics → Fun Quiz → Final Touches
- Step 3 has trivia questions about the couple (answers need to be customized by David)
- **Backend NOT yet wired up** — currently logs to console
- Plan: Google Apps Script → Google Sheets (free, no server)

## Events (all dates/venues TBD)
1. Mehendi
2. Sangeet
3. Haldi
4. Wedding Ceremony (featured/highlighted)
5. Reception

## Key Preferences
- **No emojis** — David finds them trashy. Use SVG icons or typographic ornaments instead.
- **No gift registry** — money/monetary contributions only
- **No generic AI fonts** — no Inter, Roboto, Arial, system fonts
- Hindi/Sanskrit text included for cultural touch (शुभ विवाह, आशीर्वाद, आपकी उपस्थिति हमारा सौभाग्य)

## TODO
- [ ] Wire RSVP form to Google Sheets backend via Apps Script
- [ ] Customize fun quiz answers (Step 3) with real answers
- [ ] Fill in placeholder bios for Shriya and David
- [ ] Fill in timeline story (how we met, first date, proposal)
- [ ] Add wedding date when decided
- [ ] Add venue, hotel, travel details when decided
- [ ] Fine-tune photo cropping/object-position after viewing on live site
- [ ] Add monetary gift contribution link/details
- [ ] Test responsive layout on mobile devices
