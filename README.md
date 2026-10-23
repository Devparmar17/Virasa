# Virasa — Heritage AI

A phone-sized heritage guide for India, built with Next.js (App Router). Every screen from the design is a route; `/screens` lists them all.

```bash
npm install
npm run dev      # http://localhost:3000
```

## What works

- **Onboarding** — splash, welcome, login, then two steps: interests (with story length and language) and location permission (real browser geolocation). Returning visitors skip straight to Home.
- **Home, Search, Map** — the tab bar stays on screen; the map has selectable pins, category filters, a list view and saving.
- **Place, Story, Reels** — a story player with a real timeline, chapters, speed, three transcript languages and spoken narration (the browser's own voice); reels that advance, like, save and share.
- **Walk planner** — route options and reordering change the stops, distance and time.
- **AI Guide** — chat, voice input and follow-ups handed over from other screens.
- **Voice search** — the mic on Home and Search listens with the browser's speech recognition (Chrome, Edge, Safari) and searches for what it hears.
- **Tickets and guided walks** — `/tickets`: pick a date, time and guests, pay, and keep the booking code under My tickets. Cancelling keeps a 50% cancellation charge and refunds the rest; cancelled bookings stay listed with the refund. Prices are sample values and payment is simulated; bookings are stored in the browser only.
- **Local secrets** — the three cards on Home open `/secret?id=…`, a description page shaped to the find: things to spot, dishes to eat, or legend set beside the record.
- **Trip plans** — the city cards on Home open `/plan?city=…`: choose 1–3 days and interests for a day-by-day outline, and save it to Saved › Plans.
- **Saved, Profile, Settings, Passport, Notifications, City packs, Gallery.**

Saved places, settings and downloads are remembered in the browser's localStorage. There is no account or server database yet, and city-pack and story "downloads" are recorded as flags rather than fetching files.

## Photos

Most place photographs come from Wikimedia Commons under Creative Commons licences. Their authors and licences are listed in the app at `/credits` (Settings › Photo credits) and in `public/images/CREDITS.md`. Keep those credits if you keep the photos.

## Accounts

`/login` offers Google, email sign-up, log in, or carrying on as a guest.

- **Email** accounts are stored in this browser only (password kept as a salted hash). They are for trying the flow, not real security: there is no server, password reset or sync between devices yet.
- **Google** sign-in goes through **Firebase Authentication**. In the Firebase console, turn on Authentication › Sign-in method › Google, register a Web app under Project settings, and copy its config into `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

  Restart the server afterwards. `localhost` is allowed by default; add your live domain under Authentication › Settings › Authorized domains when you deploy. (A plain Google OAuth client ID in `NEXT_PUBLIC_GOOGLE_CLIENT_ID` also works, if you'd rather not use Firebase.)

Until then the Google button explains that it isn't set up and offers email instead.

## AI Guide

Without any setup the guide answers from a small built-in library (`lib/guide.ts`) covering Ahmedabad's Old City and a few other cities, in English and partly in Hindi.

To have **Google Gemini** answer, add your key (from Google AI Studio) to `.env.local` and restart the server:

```
GEMINI_API_KEY=your-key
# optional, to use a different model:
GEMINI_MODEL=gemini-3.8-flash
```

Claude can answer instead with `ANTHROPIC_API_KEY=your-key`. When both are set Gemini answers first and Claude takes over if it fails; with neither, or if a request fails, the library answers. The route is `app/api/guide/route.ts`.

Answers are read aloud in the chosen language as well as shown (the speaker button in the guide's header turns this off), and questions can be asked by voice with the mic.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
