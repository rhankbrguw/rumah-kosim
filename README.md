<div align="center">

# Rumah Kosim Book

[![SvelteKit v2.9](https://img.shields.io/badge/SvelteKit_v2.9-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Tailwind CSS v3.4](https://img.shields.io/badge/Tailwind_CSS_v3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL v8.0+](https://img.shields.io/badge/MySQL_v8.0+-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Midtrans](https://img.shields.io/badge/Midtrans_API-00A9E0?style=flat-square)](https://midtrans.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini_v2.10-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Node.js v18+](https://img.shields.io/badge/Node.js_v18+-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

A full-stack book management web application built with SvelteKit, featuring user authentication, payment gateway integration, and complete E-Commerce operations.

</div>

---

## Architecture & Technology Stack

The application strictly adheres to a **Strict Layered Architecture** (`Controllers -> Services -> Repositories -> Database`) and follows an SSR-first approach to ensure maximum performance and maintainability.

| Layer       | Technologies                                             |
| ----------- | -------------------------------------------------------- |
| Frontend    | SvelteKit, Tailwind CSS, Superforms (Zod), Lucide Svelte |
| Backend     | SvelteKit Server-Side Rendering (SSR), Form Actions      |
| Services    | TypeScript, bcrypt, JWT, Midtrans SDK, Google Gen AI     |
| Persistence | MySQL2 (Stored Procedures, Parameterized Queries)        |

---

## Core Features

- **SSR-First Approach:** Zero client-side data fetching. Data is loaded sequentially via `+page.server.ts`, guaranteeing robust SEO and fast initial load times.
- **SvelteKit Form Actions:** All data mutations (Checkout, Add to Cart, Login, Register) are processed strictly via native HTML forms enhanced with `use:enhance`.
- **Secure Authentication:** Pure server-side session validation using HTTP-Only, Secure cookies for JWT.
- **Strict Data Validation:** Integrated `sveltekit-superforms` paired with `zod` for unbreakable client and server payload validation.
- **E-Commerce Workflow:** Complete shopping cart, address book persistence, real-time checkout updates, and Snap payment gateway integration (Midtrans).
- **Admin Capabilities:** Comprehensive dashboard for tracking orders, updating product stock, and processing image uploads.
- **AI Customer Service:** Integrated chat functionality powered by Google Gemini API to assist customers with product inquiries.

---

## Installation & Setup Guide

**System Requirements:**
- Node.js v18.0.0 or higher
- MySQL v8.0+
- npm, yarn, or pnpm

### 1. Repository Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/Samaele13/rumah-kosim-sveltekit.git
cd rumah-kosim-sveltekit
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory and configure the required variables. Use the provided keys for sandbox testing:

```env
DATABASE_URL="mysql://user:password@localhost:3306/rumah_kosim"
JWT_SECRET="your_secure_jwt_secret"

# Midtrans Configuration
MIDTRANS_SERVER_KEY="your_midtrans_server_key"
PUBLIC_MIDTRANS_CLIENT_KEY="your_midtrans_client_key"
MIDTRANS_IS_PRODUCTION="false"

# Google Gemini API
GEMINI_API_KEY="your_gemini_api_key"
```

### 3. Database Initialization

The application requires an initialized database schema to operate. Import the provided schema file located at the root of the project into your MySQL instance:

```bash
mysql -u your_username -p rumah_kosim < schema.sql
```

### 4. Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## Production Build

To compile the application for production deployment:

```bash
npm run build
npm run preview
```

---

## Authors

**Raihan Akbar** — [GitHub](https://github.com/rhankbrguw) · [LinkedIn](https://www.linkedin.com/in/raihan-akbar-2b5820334/)

**Ansya Rulloh Vini** — [GitHub](https://github.com/ansyarulloh) · [LinkedIn](https://www.linkedin.com/in/ansya-rulloh-vini-2414302a1/)
