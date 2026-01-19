# 🩸 Borejak – Blood Donation Management System

Borejak is a **production-style blood donation management system** designed to help manage donors, donation eligibility, events, and administrative control in a secure and scalable way.

This project focuses on **backend logic, authentication, and real-world system design**, rather than just UI. It integrates modern cloud services and follows best practices used in real applications.

---

## 🎯 Project Objective

The goal of Borejak is to:

* Manage **blood donors** and donation activities
* Enforce **donation eligibility rules** (90-day rule)
* Provide a secure **admin dashboard** for management
* Demonstrate real-world use of **authentication, roles, and databases**

---

## 🔗 Live Demo

🌐 **Frontend:** [https://borejak.vercel.app/](https://borejak.vercel.app/)

The application is deployed on **Vercel** and connected to live cloud services.

🔗 **Backend API Repository:**
[https://github.com/Immonkei/Borejak-Backend](https://github.com/Immonkei/Borejak-Backend)

The backend is built with **Node.js**, integrates **Firebase Authentication** for identity verification, and uses **Supabase (PostgreSQL)** as the primary database.

---

## 🚀 Key Features

### 👤 Donor Features

* User registration & login via **Firebase Authentication**
* View personal donation history
* Donation eligibility validation (must wait **90 days** between donations)
* View blood donation events and requests

### 🛠️ Admin Features

* Secure admin-only access
* View and manage donor data
* Manage donation events and blood requests
* Monitor donation activities

### 🔐 Security & Authorization

* Firebase Authentication for identity management
* Firebase ID token validation in **Node.js backend**
* Role-based access control (**Donor / Admin**)
* Protected API routes

---

## 🧱 System Architecture

```
Frontend (Next.js)
        |
        | Firebase Auth (ID Token)
        v
Backend API (Node.js)
        |
        | Secure queries
        v
Database (Supabase - PostgreSQL)
```

---

## 🧰 Tech Stack

### Frontend

* **Next.js** (React Framework)
* Tailwind CSS

### Backend

* **Node.js**
* RESTful API design

### Authentication

* **Firebase Authentication**

### Database

* **Supabase (PostgreSQL)**

### Tools & Deployment

* Git & GitHub
* Vercel (Frontend deployment)
* Supabase cloud services

---

## 🗄️ Database Design (Supabase – PostgreSQL)

Borejak uses a **relational PostgreSQL database** hosted on **Supabase**, designed to support real-world blood donation workflows, events, and administrative operations.

### 👤 users

Stores donor and admin profiles, linked with Firebase Authentication.

* `id` (UUID, PK)
* `firebase_uid` (UNIQUE)
* `email`, `phone_number`
* `full_name`
* `blood_type`
* `date_of_birth`, `gender`
* `address`
* `role` (user / admin)
* `avatar_url`
* `last_donation_date`
* `is_verified`
* `created_at`, `updated_at`

---

### 🩸 donations

Tracks donation history and enforces eligibility logic.

* `id` (UUID, PK)
* `user_id` → users(id)
* `hospital_id` → hospitals(id)
* `event_id` → events(id)
* `donation_date`
* `blood_type`
* `quantity_ml`
* `status` (pending / approved / rejected)
* `notes`
* `created_at`

> Used to validate the **90-day donation eligibility rule**

---

### 🏥 hospitals

Represents hospitals and blood collection centers.

* `id` (UUID, PK)
* `name`
* `address`
* `phone`, `email`
* `description`
* `image_url`
* `blood_inventory` (JSONB)
* `is_active`
* `created_at`, `updated_at`

---

### 📅 events

Blood donation events organized by hospitals.

* `id` (UUID, PK)
* `title`
* `description`
* `event_date`
* `location`
* `hospital_id` → hospitals(id)
* `image_url`
* `max_participants`
* `registered_count`
* `status` (upcoming / completed / cancelled)
* `created_at`, `updated_at`

---

### 🚨 blood_market

Handles urgent blood requests and public blood needs.

* `id` (UUID, PK)
* `user_id` → users(id)
* `type` (request / offer)
* `blood_type`
* `quantity_ml`
* `urgency` (normal / urgent / critical)
* `location`
* `contact_phone`
* `description`
* `status` (open / closed / expired)
* `expires_at`
* `created_at`, `updated_at`

---

### 🧠 tips

Educational content for donors.

* `id` (UUID, PK)
* `title`
* `content`
* `category`
* `image_url`
* `order`
* `is_published`
* `created_at`, `updated_at`

---

### ⭐ testimonials

User feedback and donor experiences.

* `id` (UUID, PK)
* `user_id` → users(id)
* `content`
* `rating` (1–5)
* `is_approved`
* `created_at`, `updated_at`

---

### 📩 newsletter_subscribers

Email subscriptions for updates and campaigns.

* `id` (UUID, PK)
* `email` (UNIQUE)
* `is_active`
* `created_at`

---

## 🔐 Database Highlights

* Fully **normalized relational schema**
* Strong use of **foreign keys**
* UUID-based primary keys
* JSONB for flexible hospital blood inventory
* Designed for **scalability and auditability**

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Immonkei/Borejak.git
cd Borejak
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env.local` file and configure:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

### 4️⃣ Run the project

```bash
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## 📌 Project Highlights

* Real-world **business logic** (donation eligibility rule)
* Integration of **third-party authentication** with custom backend
* Clean separation of frontend, backend, auth, and database
* Designed with **scalability and security** in mind

---

## 📈 What I Learned

* Firebase Authentication & token-based authorization
* Role-based access control in Node.js
* PostgreSQL database design using Supabase
* API protection and backend validation
* Building production-style full-stack systems

---

## 🔮 Future Improvements

* Email notifications for donation eligibility
* Admin analytics dashboard
* Audit logs for admin actions
* Mobile-first UI improvements

---

## 👨‍💻 Author

**Min Phanith**
IT Engineering Student – Royal University of Phnom Penh

📧 Email: [minphanith11@gmail.com](mailto:minphanith11@gmail.com)
🔗 LinkedIn: [https://www.linkedin.com/in/min-phanith-5a57ba33b](https://www.linkedin.com/in/min-phanith-5a57ba33b)

---

⭐ If you find this project interesting, feel free to star the repository!
