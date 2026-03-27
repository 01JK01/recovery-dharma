# Recovery Dharma App

Buddhist-inspired recovery companion. Single-page React app, PWA-enabled, all data stored locally on device.

## Deploy in 60 seconds (Vercel)

```bash
# 1. Install dependencies
npm install

# 2. Deploy to Vercel (first time - creates project)
npx vercel --prod

# 3. Future deploys (after any changes)
npm run build && npx vercel deploy --prebuilt --prod
```

That's it. Vercel gives you a live URL immediately.

## Run locally

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

## Build

```bash
npm run build
# Output in /dist — ready to deploy anywhere
```

## Tech stack
- React 18 + Vite
- PWA (installable on iPhone home screen)
- All data: localStorage (no backend needed)
- Fonts: Cormorant Garamond + DM Sans
