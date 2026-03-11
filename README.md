# PetSoft

PetSoft is a full-stack pet daycare management app built with **Next.js**, **TypeScript**, **Prisma**, and **PostgreSQL**.

The project demonstrates building a modern web application with authenticated routes, server-side data handling, form validation, database integration, and a polished UI. Users can sign up, log in, access a protected dashboard, and manage pets through actions such as adding, editing, searching, and checking out pets.

## Live Demo

[View the live app](https://petsoft-five.vercel.app)

## Features

- Authentication flow for account access
- Protected application area
- Pet dashboard UI
- Add new pets
- Edit existing pet information
- Check out pets
- Search pets
- Form validation
- Toast notifications for feedback
- Seeded demo data for local testing

## Tech Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- Lucide React

**Backend / Data**
- Prisma
- PostgreSQL
- Server Actions

**Auth / Validation / Payments**
- NextAuth
- React Hook Form
- Zod
- Stripe

## Why I Built This

I built PetSoft to strengthen my full-stack frontend development skills through a practical project with real application structure.

This project helped me practice:

- building with the Next.js App Router
- structuring public, auth, and protected app routes
- working with Prisma and PostgreSQL
- handling form validation with React Hook Form and Zod
- implementing authentication
- writing server-side mutation logic
- building reusable and responsive UI components

## Project Structure

```bash
petsoft/
├── actions/
├── app/
│   ├── (app)/
│   ├── (auth)/
│   ├── (marketing)/
│   └── api/
├── components/
├── contexts/
├── lib/
├── prisma/
├── public/
└── styles/
