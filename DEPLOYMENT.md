Deployment Guide (Vercel + Render + MongoDB Atlas)

1) Push repo to GitHub.

2) Frontend -> Vercel
- Create a new Vercel project, connect to GitHub repo, select `frontend` folder as project root.
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment: none required for basic demo. Set CLIENT_URL to https://<your-vercel-domain>

3) Backend -> Render (Web Service)
- Create new Web Service on Render, connect GitHub repo, select `backend` folder as root.
- Build Command: `npm install && npm run build` (if no build skip)
- Start Command: `npm run start` or `npm run dev` for nodemon (dev only)
- Add environment variables (from backend/.env.example) in Render dashboard.

4) MongoDB Atlas
- Create free cluster, create DB user, whitelist Render IPs (or allow access from anywhere during testing).
- Copy connection string into backend/.env

5) Stripe
- Create product and price (or let the backend create it on the fly).
- Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in Render env vars.
- Add Render webhook endpoint URL to Stripe dashboard (e.g., https://<render-service>/api/stripe/webhook)

6) MT5 Bridge
- Run the backend/mt5_bridge/mt5Service.py on a Windows machine with MetaTrader5 installed and logged in.
- Make sure MT5_BRIDGE_URL points to that machine (use ngrok/tunnel or deploy bridge on VPS with MT5).

7) After deployment, open the frontend domain and test the flow.

If you want, I can prepare the GitHub repo and then guide you through connecting Vercel and Render step-by-step.
