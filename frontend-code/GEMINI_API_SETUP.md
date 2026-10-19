# 🤖 AI Setup Guide (OpenRouter)

The chatbot and AI investment advisor use **OpenRouter** — a free AI gateway that works reliably without key format issues.

## Step 1: Get Your Free OpenRouter API Key

1. Go to **https://openrouter.ai** and sign up
2. Go to **https://openrouter.ai/keys**
3. Click **"Create Key"**
4. Copy the key — it looks like: `sk-or-v1-...`

## Step 2: Local Development

Add to `frontend-code/.env`:
```
VITE_API_BASE_URL=http://localhost:4000/api
```

Add to `backend/.env`:
```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

Restart the backend:
```bash
cd backend
npm run dev
```

## Step 3: Production (Vercel)

The AI calls go through a Vercel serverless function (`/api/ai`) so the key is never exposed in the browser.

**Frontend Vercel project → Settings → Environment Variables:**
| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://your-backend.vercel.app/api` |
| `OPENROUTER_API_KEY` | `sk-or-v1-your-key-here` |

Then redeploy the frontend.

## How It Works

```
Browser → /api/ai (Vercel serverless) → OpenRouter → AI Model
```

- Key is stored server-side, never in the browser bundle
- Uses free models: `nvidia/nemotron-3.5-super-vl:free` with fallbacks
- Automatic retry with fallback models if one is rate-limited

## Features Powered by AI

- **PocketPal Chatbot** — bottom-right button, answers finance & app questions
- **AI Investment Advisor** — on Dashboard, analyzes your transactions and gives investment suggestions
- **AI Spending Analysis** — on Analytics page, analyzes your spending patterns

## Troubleshooting

- **"AI not configured"** — check `OPENROUTER_API_KEY` is set in Vercel env vars and redeployed
- **"AI service unavailable"** — free model rate limit hit, will auto-retry with next model
- **Chatbot "trouble connecting"** — make sure `VITE_API_BASE_URL` points to production backend
