<div align="center">

# RumahKosimBooks

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

A full-stack book management web application built with SvelteKit, featuring user authentication and complete CRUD operations.

</div>

---

## Architecture & Tech Stack

The application strictly adheres to a **Strict Layered Architecture** (`Controllers -> Services -> Repositories -> Database`) and is fully SSR-first.

| Layer       | Technologies                                             |
| ----------- | -------------------------------------------------------- |
| Frontend    | SvelteKit, Tailwind CSS, Superforms (Zod), Lucide Svelte |
| Backend     | SvelteKit Server-Side Rendering (SSR), Form Actions      |
| Services    | TypeScript, bcrypt, JWT (HTTP-Only Cookies)              |
| Persistence | MySQL2 (Stored Procedures, Parameterized Queries)        |

---

## Features

- **SSR-First Approach:** Zero client-side data fetching (`onMount`), guaranteeing blazing-fast initial load times and robust SEO.
- **SvelteKit Form Actions:** All data mutations (Checkout, Add to Cart, Login, Register, Admin Panel) are processed strictly via native HTML forms (`use:enhance`), eliminating the need for `axios` or client-side REST APIs.
- **Secure Authentication:** Pure server-side session validation using HTTP-Only, Secure cookies for JWT.
- **Strict Data Validation:** Integrated `sveltekit-superforms` paired with `Zod` for unbreakable client and server validation.
- **E-Commerce Flow:** Complete shopping cart, checkout, and order history workflows.
- **Admin Panel:** Comprehensive dashboard for tracking orders, updating stock, and product image uploads.

---

## Getting Started

**Prerequisites:** Node.js v14+, MySQL, npm/pnpm/yarn

1. Clone and install:

```bash
git clone https://github.com/Samaele13/rumah-kosim-sveltekit.git
cd rumah-kosim-sveltekit
npm install
```

2. Create a `.env` file:

```env
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
JWT_SECRET="your_jwt_secret"
```

3. Set up the MySQL database and import the provided SQL scripts.

4. Run the development server:

```bash
npm run dev
```

---

## Build

```bash
npm run build
npm run preview
```

---

## License

This project was created for academic purposes only and is not licensed for public or commercial use.

---

## Authors

**Raihan Akbar** — [GitHub](https://github.com/rhankbrguw) · [LinkedIn](https://www.linkedin.com/in/raihan-akbar-2b5820334/)

**Ansya Rulloh Vini** — [GitHub](https://github.com/ansyarulloh) · [LinkedIn](https://www.linkedin.com/in/ansya-rulloh-vini-2414302a1/)
