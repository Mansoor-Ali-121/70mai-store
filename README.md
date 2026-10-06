# 70mai Storefront & LunarPHP Integration

A polished local e-commerce storefront inspired by the 70mai US website, powered by **Laravel 11**, **LunarPHP (Headless Commerce)**, **Filament Admin**, and **Inertia.js with React**.

---

## Tech Stack

- **Backend:** Laravel 11, LunarPHP (Headless Commerce), MySQL / SQLite, Filament Admin Panel
- **Frontend:** Inertia.js, React, Tailwind CSS
- **State & Cart Management:** LunarPHP Cart API integrated with reactive frontend components

---

## Features & Scope

- **Frontend Recreation:** Responsive layout (desktop, tablet, mobile), navigation bar, hero banner, major homepage sections (including product showcases), and reusable component architecture built using Inertia.js and React with Tailwind CSS.
- **Backend Integration:** Powered by LunarPHP headless commerce. Real-time product listing, details, pricing, and media fetched directly from the database (fully dynamic).
- **Cart & Commerce Logic:** Add to cart, quantity adjustments (`+`/`-`), item removal, and live backend-calculated cart totals.
- **Admin Management:** Filament admin panel integration for managing products, prices, categories, and orders.

---

## Prerequisites

Ensure you have the following installed on your local machine:
- PHP >= 8.2
- Composer
- Node.js & npm
- Git

---

## Installation & Setup Guide

### 1. Clone the Repository
```bash
git clone [https://github.com/Mansoor-Ali-121/70mai-store.git](https://github.com/Mansoor-Ali-121/70mai-store.git)

2. Install PHP Dependencies
Bash
composer install
3. Environment Configuration
Copy the example environment file and configure your database settings:

Bash
cp .env.example .env
php artisan key:generate
4. Database Setup & Seeders
Run migrations and seed the initial products, categories, and admin user data:

Bash
php artisan migrate --seed
5. Install Frontend Dependencies & Build Assets
Install Node modules and compile the Inertia/React frontend assets:

Bash
npm install
npm run dev
6. Run the Application
Start the local Laravel development server:

Bash
php artisan serve
Storefront URL: http://127.0.0.1:8000

Filament Admin Panel URL: http://127.0.0.1:8000/admin