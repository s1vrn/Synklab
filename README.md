# SynkLab Web Platform

Modern marketing site and lightweight API for SynkLab, a product team focused on secure, high-performance digital experiences.

## Stack

- `frontend/`: React 19, Vite, Tailwind CSS 3
- `backend/`: Node.js, Express, Helmet, CORS

## Local Development

```bash
# start backend API
cd backend
npm install
npm run start

# start frontend app (new terminal)
cd frontend
npm install
npm run dev
```

The frontend reads API data from `VITE_API_BASE_URL` (defaults to `http://localhost:4000`). Create `frontend/.env` if you need to override it.

## API Overview

- `GET /api/status` – health and environment info
- `GET /api/team` – team members used on the About section
- `GET /api/showcase` – featured project portfolio details
- `POST /api/newsletter` – subscribes an email to the Mailchimp audience (requires API keys)

## Deployment Notes

1. Build frontend: `cd frontend && npm run build` (outputs to `frontend/dist`)
2. Deploy the Express app alongside the static build, or host the frontend separately (e.g. Vercel/Netlify) and set `VITE_API_BASE_URL`.

## Environment Setup

Create a `.env` file in `backend/` (or provide the variables in your hosting environment):

```
PORT=4000
MAILCHIMP_API_KEY=your-mailchimp-api-key
MAILCHIMP_SERVER_PREFIX=usX             # e.g. us21
MAILCHIMP_AUDIENCE_ID=your-audience-id  # list / audience ID
CLIENT_ORIGIN=http://localhost:5173     # optional: tighten CORS
```

The newsletter form calls the backend endpoint, which relays the request to Mailchimp using these credentials.

## Deploying to Vercel

This repo is configured for a monorepo deploy:

- `frontend/` → built with `@vercel/static-build` (Vite output served as static assets).
- `backend/api/*.js` → deployed as Vercel Serverless Functions (Express server remains for local development).

Steps:

1. Push the latest changes to GitHub.
2. In Vercel, create a new project pointing to this repository.
3. Set the root directory to the repository root (so the provided `vercel.json` is used).
4. Define the environment variables listed above in the Vercel project settings.
5. Trigger a deploy; Vercel will build the frontend and provision `/api/*` routes automatically.

## Inspiration

Design language inspired by [SEO Specialist](https://www.seospecialist.ma/) while tailored to SynkLab’s brand voice.
