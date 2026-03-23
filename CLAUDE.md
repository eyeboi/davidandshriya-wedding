# David & Shriya Wedding Website

## Couple
- **Groom**: David Taylor Gonzalez, MD — grew up in Nicaragua, moved to Florida at age 8, Ophthalmology
- **Bride**: Shriya Airen, MD — grew up in Edison, NJ, ENT, loves scuba diving & her puppy Kal
- **Both attended University of Miami for medical school**
- **Met**: First day of med school, sorted into the same academic society during orientation
- **First Date**: January 8, 2020 — beach date, David cracked open a coconut with a rock
- **Proposal**: March 15, 2026 — on the beach where it all started
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
- Images optimized to max 2000px, quality 80 (300-700KB each)

## Site Structure (multi-page)
```
index.html              — Home: hero, our story, bios, timeline, RSVP CTA
events.html             — All 6 events with dress codes
travel.html             — Venue, hotel, transit, explore cards
gifts.html              — Monetary gifts (Zelle, Venmo, Cash App, PayPal)
faq.html                — 6 FAQ items
rsvp.html               — Multi-step RSVP form with guest list enforcement
css/style.css           — Main site styles (shared across all pages)
css/subpage.css         — Shared subpage styles (nav, page hero)
css/rsvp.css            — RSVP page-specific styles
js/main.js              — Main site JS (particles, scroll reveals, nav)
js/rsvp.js              — RSVP multi-step form logic + Apps Script URL
google-apps-script.js   — Reference copy of Google Apps Script backend code
images/                 — All photos and SVGs (optimized, max 2000px)
  hero.jpeg         — Proposal wide shot
  shriya.jpeg       — Shriya golden hour
  david.jpeg        — David with ring
  couple-lift.jpeg  — Both together by ocean
  proposal.jpeg     — On one knee (also used for OG preview)
  celebration.jpeg  — Celebrating together
  ring-detail.jpeg  — Ring closeup
  ring-hands.jpeg   — Hands with ring
  golden-hour.jpeg  — Shriya full-body sunset
  together.jpeg     — Looking out at ocean (footer photo)
  favicon.svg       — D&S text favicon
  mandala.svg       — Decorative mandala (unused currently)
```

## Navigation
All pages share a consistent nav: Home, Events, Travel, Gifts, FAQ, RSVP (CTA button).
Each subpage has a page hero with a background photo, the same footer, and an RSVP CTA section.

## Photo Source
Original photos are in:
`/Users/davidtaylor/Library/Mobile Documents/com~apple~CloudDocs/Documents/Medical Research & Publications/Ophthalmology/Operation Sunrise/Faves Exported/`

Images have been resized to max 2000px and compressed to quality 80 for web performance.

## RSVP Form & Backend
- 4-step multi-step form: Basics -> Events & Logistics -> Fun Quiz -> Final Touches
- **Guest list enforcement**: Name field autocompletes from a guest list stored in Google Sheet #3. Only names on the list can submit an RSVP.
- **Decline shortcut**: If "Regretfully Declines" is selected on step 1, form skips to step 4 (Final Touches)
- Step 3 has trivia questions about the couple (answers need to be customized by David)
- **Backend**: Google Apps Script -> Google Sheets (live and working)
- **Apps Script URL**: Stored in `js/rsvp.js` as `GOOGLE_SCRIPT_URL`
- **API endpoints** (via GET params on the Apps Script URL):
  - `?action=read` — returns all RSVP data as JSON
  - `?action=delete&row=N` — deletes row N (must be >= 2)
  - `?action=update&row=N&col=N&value=X` — updates a single cell
  - `?action=clear&row=N` — clears all content in a row
  - `?action=dashboard` — rebuilds the Dashboard summary sheet
  - `?action=status` — health check with row count
  - `?action=guestlist` — returns guest names from Sheet #3
  - `?action=setupGuestList` — creates Sheet #3 with test names
- **Google Sheet structure**:
  - Sheet 1: RSVP responses
  - Sheet 2: Dashboard (auto-generated)
  - Sheet 3: Guest List (column A = names, managed manually)
- **Dashboard sheet**: Auto-created "Dashboard" tab with headcount, event counts, meal prefs, shuttle/kids logistics, sides, song requests, and marriage advice. Auto-updates on each new RSVP submission.
- **Email notification**: Optional, requires updating `YOUR_EMAIL@gmail.com` in google-apps-script.js
- **Important**: Each time you redeploy the Apps Script, the URL changes. Update it in `js/rsvp.js` and push.
- `google-apps-script.js` is a reference copy — the actual code runs inside the Google Sheet's Apps Script editor

## Events (all dates/venues TBD)
1. Mehendi
2. Sangeet
3. Haldi
4. Wedding Ceremony (featured/highlighted)
5. Reception
6. Goodbye Brunch

## Key Preferences
- **No emojis** — David finds them trashy. Use SVG icons or typographic ornaments instead.
- **No gift registry** — money/monetary contributions only
- **No generic AI fonts** — no Inter, Roboto, Arial, system fonts
- Hindi/Sanskrit text included for cultural touch

## Deployment Notes
- Each `git push origin main` triggers a Netlify deploy (costs 15 Netlify credits per deploy)
- Batch changes into fewer commits to conserve Netlify credits
- Open Graph preview image: `images/proposal.jpeg` (landscape, on-one-knee shot)

## TODO
- [x] Wire RSVP form to Google Sheets backend via Apps Script
- [x] Add API endpoints for reading/editing sheet data
- [x] Add auto-updating Dashboard summary sheet
- [x] Fill in placeholder bios for Shriya and David
- [x] Fill in timeline story (how we met, first date, proposal)
- [x] Split Events, Gifts, Travel, FAQ into separate pages
- [x] Add guest list enforcement to RSVP form
- [x] Optimize images for web (resize + compress)
- [x] Add goodbye brunch event
- [ ] Customize fun quiz answers (Step 3) with real answers
- [ ] Add wedding date when decided
- [ ] Add venue, hotel, travel details when decided
- [ ] Add monetary gift contribution details (Zelle, Venmo, Cash App, PayPal handles)
- [ ] Update YOUR_EMAIL@gmail.com in google-apps-script.js for email notifications
- [ ] Test responsive layout on mobile devices
