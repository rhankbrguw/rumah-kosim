# Rumah Kosim Book

Full-stack book store built with SvelteKit, SSR-first. Handles auth, cart, checkout with Midtrans, and also Gemini-powered chat widget for customer questions.

---

Clone, install, set up env:

```bash
git clone https://github.com/Samaele13/rumah-kosim-sveltekit.git
cd rumah-kosim-sveltekit
npm install
```

Add a `.env` with `DATABASE_URL`, `JWT_SECRET`, `MIDTRANS_SERVER_KEY`, `PUBLIC_MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION`, `GEMINI_API_KEY`.

Import the schema before running anything: `mysql -u your_username -p rumah_kosim < schema.sql`.

Then `npm run dev`, served at `localhost:5173`.

---

Build for prod with `npm run build && npm run preview`.

Requires Node 18+ and MySQL 8+.
