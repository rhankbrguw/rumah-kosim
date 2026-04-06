# RumahKosimBooks

A full-stack book management web application built with SvelteKit, featuring user authentication and complete CRUD operations.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | SvelteKit, Tailwind CSS, Axios |
| Backend | SvelteKit API Routes, JWT, bcrypt, MySQL2 |

---

## Features

- User authentication (Register & Login)
- JWT-based session management
- Book management (CRUD)
- Admin panel (CRUD)

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

**Raihan Akbar** — [GitHub](https://github.com/Samaele13) · [LinkedIn](https://www.linkedin.com/in/raihan-akbar-2b5820334/)

**Ansya Rulloh Vini** — [GitHub](https://github.com/ansyarulloh) · [LinkedIn](https://www.linkedin.com/in/ansya-rulloh-vini-2414302a1/)
