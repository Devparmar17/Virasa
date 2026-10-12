# Virasa — Heritage AI

A phone-sized heritage guide for India, built with Next.js (App Router). Every screen from the design is a route; `/screens` lists them all.

```bash
npm install
npm run dev      # http://localhost:3000
```

## What works

- **Onboarding** — splash, welcome, interests, location permission (real browser geolocation). Returning visitors skip straight to Home.
- **Home, Search, Map** — the tab bar stays on screen; the map has selectable pins, category filters, a list view and saving.
- **Place, Story, Reels** — a story player with a real timeline, chapters, speed, three transcript languages and spoken narration (the browser's own voice); reels that advance, like, save and share.
- **Walk planner** — route options and reordering change the stops, distance and time.
- **AI Guide** — chat, voice input and follow-ups handed over from other screens.
- **Saved, Profile, Settings, Passport, Notifications, City packs, Gallery.**

Saved places, settings and downloads are remembered in the browser's localStorage. There is no account or server database yet, and city-pack and story "downloads" are recorded as flags rather than fetching files.

## Accounts

`/login` offers Google, email sign-up, log in, or carrying on as a guest.

- **Email** accounts are stored in this browser only (password kept as a salted hash). They are for trying the flow, not real security: there is no server, password reset or sync between devices yet.
- **Google** needs an OAuth client ID. In Google Cloud Console create an *OAuth client ID* of type *Web application*, add `http://localhost:3000` (and your live URL) under *Authorised JavaScript origins*, then put it in `.env.local` and restart:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Until then the Google button explains that it isn't set up and offers email instead.

## AI Guide

Without any setup the guide answers from a small built-in library (`lib/guide.ts`) covering Ahmedabad's Old City and a few other cities, in English and partly in Hindi.

To have Claude answer instead, create `.env.local` with:

```
ANTHROPIC_API_KEY=your-key
```

and restart the dev server. The route is `app/api/guide/route.ts`; if the request fails it falls back to the library.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
