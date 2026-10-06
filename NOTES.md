# Project Notes (NOTES.md)

## 1. Project Overview
- **Project Name:** 70mai Storefront & LunarPHP Integration
- **Objective:** Build a polished local e-commerce storefront inspired by the 70mai US website and connect it to a working LunarPHP headless commerce backend[cite: 14].

## 2. Completed Scope & Features
- **Frontend Recreation:**
  - Responsive header and navigation bar supporting desktop, tablet, and mobile layouts.
  - Hero banner closely matching the spacing, typography, and visual hierarchy of the reference.
  - Major homepage sections including product showcases and series tabs.
  - Reusable product cards and UI components built with Inertia.js, React, and Tailwind CSS.
- **LunarPHP & Laravel Backend Integration:**
  - Fully dynamic product catalog fetched from the database (titles, pricing, images, and categories).
  - Backend changes in the Filament admin panel instantly reflect on the frontend upon refresh.
  - Product detail pages displaying live backend data.
- **Cart & Commerce Logic:**
  - Add to cart functionality, quantity increment/decrement (`+`/`–`), item removal, and live backend-calculated cart totals.

## 3. Incomplete / Optional Scope
- Payment processing flows were kept as optional bonus work and are not fully implemented, as per assessment guidelines[cite: 14].

## 4. Technical Decisions & Trade-Offs
- **Stack Selection:** Utilized Laravel 11 with Inertia.js and React to provide a modern, single-page application (SPA) experience while maintaining clean integration with LunarPHP's underlying data models.
- **Component Architecture:** Focused heavily on reusable frontend components to keep code DRY and maintainable.