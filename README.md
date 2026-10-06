# QuickBite - Production-Style Food Delivery Web Platform

QuickBite is a full-stack, commercial-grade Food Delivery Web Application built with **ASP.NET Core Web API (C#)**, **Entity Framework Core**, **MySQL**, and **React**.

---

## 🏗️ Architecture Overview

```text
React Frontend (FoodDelivery.Web)
        │
        ▼ (REST APIs / JWT Bearer)
ASP.NET Core Web API (FoodDelivery.API)
        │
        ├── Controllers (HTTP Request Layer)
        ├── Services (Business & Order Logic)
        ├── Repositories (EF Core Data Access)
        └── ApplicationDbContext (Pomelo MySQL Provider)
        │
        ▼
MySQL Database (food_delivery_db)
```

---

## 🚀 Technology Stack

- **Backend Framework**: ASP.NET Core 8 Web API (C#)
- **Database & ORM**: Entity Framework Core 8.0, Pomelo MySQL Provider
- **Authentication**: JWT Bearer Tokens with Custom Claims & BCrypt Password Hashing
- **Frontend**: React (Vite), JavaScript, React Router v6, Lucide React Icons
- **Styling**: Modern Responsive CSS (CSS Custom Properties & Glassmorphism design system)

---

## 👥 Key Features & User Roles

### 1. 🛒 Customer Experience
- **Restaurant Discovery**: Search by name, cuisine, rating, delivery fee, or price.
- **Menu Browsing**: Category tabs, food modal previews, vegetarian/non-vegetarian indicators, discount prices.
- **Cart Management**: Real-time single-restaurant cart enforcement, item quantity controls, subtotal calculation.
- **Address Management**: Saved delivery addresses with default selection.
- **Checkout**: Cash on Delivery (COD) and Online Payment selection, coupon discount calculation (`QUICK50`, `WELCOME100`).
- **Live Order Tracking**: Interactive step-by-step order status pipeline (`PLACED` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `READY` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`).
- **Reviews & Ratings**: Post-delivery order rating and review submission.

### 2. 🏪 Restaurant Owner Portal
- **Dashboard**: Real-time revenue overview, order metrics, and pending order count.
- **Order Processing**: Accept/Confirm incoming orders, set status to `PREPARING`, and mark `READY`.
- **Menu Management**: Add new food dishes with prices, discount offers, preparation times, and images.

### 3. 🛵 Delivery Partner Portal
- **Pickup Orders Feed**: View orders marked `READY` by partner restaurants.
- **Order Acceptance**: Assign deliveries and update status to `OUT_FOR_DELIVERY` and `DELIVERED`.

### 4. 🛡️ System Admin Control Center
- **Platform Analytics**: Total users, total restaurants, total orders, and Gross Merchandise Value (GMV) revenue.
- **User Moderation**: View registered accounts with role filters and toggle account activation/deactivation.
- **Restaurant Moderation**: Enable or disable restaurant listings platform-wide.

---

## 🔑 Development Demo Credentials

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@quickbite.com` | `Admin@123` |
| **Restaurant Owner** | `ramesh@biryanihouse.com` | `Owner@123` |
| **Delivery Partner** | `delivery@quickbite.com` | `Delivery@123` |
| **Customer** | `customer@quickbite.com` | `Customer@123` |

---

## ⚡ Setup & Local Execution

### 1. Database & Backend Setup
Ensure MySQL (MySQL Server 8.0 or XAMPP MySQL) is running on `localhost:3306`. Update `appsettings.json` with your MySQL password.

```bash
# Run EF Core Migrations
dotnet ef database update

# Run ASP.NET Core Web API Server
dotnet run --urls "http://localhost:5000"
```

### 2. Frontend Setup

```bash
cd FoodDelivery.Web

# Install dependencies
npm install

# Start Vite Development Server
npm run dev
```

Open `http://localhost:5173` in your browser to access the application.
