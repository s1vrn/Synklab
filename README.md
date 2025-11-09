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

## Deployment Notes

1. Build frontend: `cd frontend && npm run build` (outputs to `frontend/dist`)
2. Deploy the Express app alongside the static build, or host the frontend separately (e.g. Vercel/Netlify) and set `VITE_API_BASE_URL`.

## Inspiration

Design language inspired by [SEO Specialist](https://www.seospecialist.ma/) while tailored to SynkLab’s brand voice.
