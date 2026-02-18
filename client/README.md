# Frontend Deployment (Cloudflare Pages)

This frontend is configured to deploy independently on Cloudflare Pages while using the backend hosted on Vercel.

## Required Cloudflare Pages settings

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `client`

## Environment variables

- `VITE_FIREBASE_API_KEY=<your_firebase_key>`
- `API_BASE_URL=https://tourist-backend-kappa.vercel.app`

`API_BASE_URL` is used by `functions/api/[[path]].js` to proxy requests from `/api/*` to your backend.

## Cookie/Auth behavior

- Frontend calls `/api/*`.
- Cloudflare Pages Function proxies to backend.
- Browser cookies are set on your Cloudflare frontend domain, so login/logout/session works without browser CORS cookie issues.

## Optional direct mode

If you want to bypass the proxy for local/testing, set:

- `VITE_API_BASE_URL=https://tourist-backend-kappa.vercel.app`

When this is set, frontend requests go directly to that backend URL.
