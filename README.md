# 🏨 Home Away | Enterprise Hospitality & Property Management Suite
Full-stack MERN Hotel Management &amp; Booking Suite featuring JWT authentication, role-based access control (RBAC), multi-criteria room filtering, simulated secure checkout, guest reservation tracking, and an admin housekeeping console.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/mongodb-8.3.1-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/express.js-4.19.2-lightgrey.svg)](https://expressjs.com/)

---

## 📑 Table of Contents
1. [Executive Summary & Introduction](#-executive-summary--introduction)
2. [Problem Statement & Industry Context](#-problem-statement--industry-context)
3. [Proposed System Solution](#-proposed-system-solution)
4. [Core Features & Functional Modules](#-core-features--functional-modules)
5. [Technology Stack & Architectural Rationale](#-technology-stack--architectural-rationale)
6. [System Architecture & Data Flow](#-system-architecture--data-flow)
7. [Database Schema Design & Entity Relationships](#-database-schema-design--entity-relationships)
8. [Comprehensive API Specification & Endpoints](#-comprehensive-api-specification--endpoints)
9. [Project Directory Structure](#-project-directory-structure)
10. [Local Setup & Installation Guide](#-local-setup--installation-guide)
11. [Security & Authentication Architecture](#-security--authentication-architecture)
12. [Operational Workflows & Sequences](#-operational-workflows--sequences)
13. [Testing, Quality Assurance, & Validation](#-testing-quality-assurance--validation)
14. [Scalability & Future Roadmap](#-scalability--future-roadmap)
15. [License & Governance](#-license--governance)

---

## 🚀 1. Executive Summary & Introduction

**Home Away** is a comprehensive, enterprise-grade hospitality and property management web ecosystem engineered from the ground up using the robust **MERN stack** (MongoDB, Express.js, React, Node.js). Designed to cater to everything from independent boutique hotels to expansive multi-room hospitality chains, Home Away bridges the operational gap between seamless guest-facing booking interfaces and rigorous back-office administrative control. 

By prioritizing high-performance data indexing, stateless cryptographic authentication, and transactional integrity, Home Away delivers a reliable, digital-first operational spine that modernizes day-to-day hospitality management.

---

## 💡 2. Problem Statement & Industry Context

The modern hospitality industry suffers significantly from legacy software fragmentation. Traditional Property Management Systems (PMS) are frequently bottlenecked by several critical operational limitations:
* **High Latency & Monolithic Bottlenecks:** Legacy systems struggle to serve high concurrent traffic during seasonal booking surges, leading to sluggish search performance and user abandonment.
* **Overbooking Vulnerabilities:** Inadequate concurrency management during peak inventory selection often results in catastrophic double-bookings, harming guest trust and hotel revenue.
* **Fragmented Operational Workflows:** Disjointed communication channels between front-desk operators, housekeeping crews, and guests cause delays in room turnover and suboptimal guest satisfaction metrics.
* **Security & Data Privacy Gaps:** Inadequate handling of session state and sensitive guest data creates compliance risks under strict data privacy regulations.

---

## 🎯 3. Proposed System Solution

Home Away resolves these enterprise challenges through a clean, modular monolithic architecture built for high maintainability and performance:
* **Atomic Transaction Handling:** Ensures that room reservations and booking states maintain strict validity checks, neutralizing overbooking race conditions.
* **Unified Role-Based Control:** Enforces strict boundary separation between guest privileges and administrative management panels.
* **Real-Time Operational Transparency:** Introduces instant housekeeping tracking flags (`Clean`, `Dirty`, `Maintenance`) to accelerate room readiness cycles.
* **Streamlined User Journeys:** Offers intuitive multi-criteria filtering and secure checkout modal simulations to optimize conversion rates.

---

## ✨ 4. Core Features & Functional Modules

### 👤 Guest Experience & Discovery Module
* **Advanced Room Discovery & Filtering:** Guests can dynamically filter available inventories using real-time parameter controls, sorting by category (*Single, Double, Deluxe, Suite, Penthouse*) and maximum nightly budget thresholds.
* **Simulated Secure Checkout Modal:** Captures stay date intervals, automatically calculates total pricing across stay durations, and collects mock card verification details before committing transactions.
* **Guest Reservation Dashboard ("My Bookings"):** A dedicated client-side portal where users can review upcoming or past stays, check financial totals, and safely initiate booking cancellations.
* **Peer Reviews & Ratings Architecture:** Allows verified patrons to publish commentary and score ratings (1–5) tied directly to individual room identifiers.

### 🛡️ Administrative & Staff Console Module
* **Role-Based Access Control (RBAC):** Restricts high-privilege mutations—such as inventory seeding or global reservation audits—strictly to authenticated administrative personnel.
* **Housekeeping & Maintenance Tracker:** Empowers operational staff to instantly toggle room cleanliness states (`Clean`, `Dirty`, `Maintenance`), synchronizing status visibility across the application.
* **Inventory Management Suite:** A robust dashboard interface enabling hotel managers to provision new rooms, adjust nightly tariffs, define guest capacity bounds, and curate descriptions.

---

## 🛠️ 5. Technology Stack & Architectural Rationale

| Layer | Selected Technology | Version | Rationale & Architectural Benefit |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | React | 18.3.1 | Component-driven architecture, highly reactive state hooks, and rich ecosystem support. |
| **Build Tooling** | Vite | 5.2.11 | Lightning-fast Hot Module Replacement (HMR) and optimized production bundling. |
| **Backend Runtime** | Node.js | 18.x+ | Asynchronous event-driven I/O model suited for high-concurrency API request handling. |
| **API Framework** | Express.js | 4.19.2 | Minimalist, unopinionated routing structure with robust middleware support. |
| **Database ODM** | MongoDB & Mongoose | 8.3.1 | Flexible NoSQL document design allowing rapid iteration on dynamic hotel metadata structures. |
| **Security Suite** | JWT & bcryptjs | Latest | Stateless token authorization paired with salt-rounds cryptographic password hashing. |

---

## 🏗️ 6. System Architecture & Data Flow

Home Away follows a modular client-server separation design pattern. The React single-page application (SPA) communicates asynchronously with the Express REST API via JSON payloads over HTTP, leveraging Bearer token headers for authorization.

```text
┌────────────────────────────────────────────────────────┐
│                   React SPA Client                     │
│               (Vite Dev Server :5173)                  │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST (JSON) + Bearer Token
                            ▼
┌────────────────────────────────────────────────────────┐
│               Express.js REST API Server               │
│                (Node.js Runtime :5000)                 │
├────────────────────────────────────────────────────────┤
│  Middleware: CORS, Auth Guard (JWT), RBAC Admin Check  │
├────────────────────────────────────────────────────────┤
│  Routers: /api/auth | /api/rooms | /api/bookings         │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose ODM Driver
                            ▼
┌────────────────────────────────────────────────────────┐
│             MongoDB Local Database Cluster             │
│                 (mongod service :27017)                │
└────────────────────────────────────────────────────────┘

```

---

## 📊 7. Database Schema Design & Entity Relationships

The database layer consists of four core Mongoose models, optimized for relational referencing via MongoDB `ObjectId` fields:

1. **User Model (`User.js`):**
* Fields: `name` (String), `email` (String, Unique), `password` (String, Hashed), `role` (`guest` | `admin`).


2. **Room Model (`Room.js`):**
* Fields: `name` (String), `type` (Enum), `pricePerNight` (Number), `maxCapacity` (Number), `description` (String), `image` (String), `housekeepingStatus` (`Clean` | `Dirty` | `Maintenance`), `isAvailable` (Boolean).


3. **Booking Model (`Booking.js`):**
* Fields: `user` (ObjectId ref User), `room` (ObjectId ref Room), `checkInDate` (Date), `checkOutDate` (Date), `guestsCount` (Number), `totalAmount` (Number), `paymentStatus` (`Paid` | `Pending` | `Refunded`), `status` (`Confirmed` | `Cancelled`).


4. **Review Model (`Review.js`):**
* Fields: `room` (ObjectId ref Room), `user` (ObjectId ref User), `rating` (Number 1–5), `comment` (String).



---

## 🔌 8. Comprehensive API Specification & Endpoints

### Authentication Endpoints (`/api/auth`)

* `POST /api/auth/register`
* *Desc:* Registers a new user account and returns a signed JWT token.


* `POST /api/auth/login`
* *Desc:* Authenticates user credentials and issues a session JWT.


* `GET /api/auth/me`
* *Desc:* Fetches the profile details of the currently authenticated user (Protected).



### Room Inventory Endpoints (`/api/rooms`)

* `GET /api/rooms`
* *Desc:* Retrieves all rooms. Supports query parameters: `?type=Deluxe&maxPrice=300&status=Clean`.


* `GET /api/rooms/:id`
* *Desc:* Retrieves full attributes for a specific room identifier.


* `POST /api/rooms`
* *Desc:* Provisions a new room into inventory (Admin Only).


* `PATCH /api/rooms/:id/housekeeping`
* *Desc:* Updates the cleanliness housekeeping status of a room (Admin Only).


* `DELETE /api/rooms/:id`
* *Desc:* Permanently removes a room from inventory (Admin Only).



### Booking & Reservation Endpoints (`/api/bookings`)

* `GET /api/bookings/mybookings`
* *Desc:* Fetches all historical and active reservations belonging to the caller (Protected).


* `GET /api/bookings`
* *Desc:* Retrieves all platform reservations across all users (Admin Only).


* `POST /api/bookings`
* *Desc:* Commits a new room reservation transaction (Protected).


* `PUT /api/bookings/:id/cancel`
* *Desc:* Cancels an active reservation and schedules financial refund status adjustments (Protected).



---

## 📁 9. Project Directory Structure

```text
home-away/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── reviewRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── RoomList.jsx
        │   ├── MyBookings.jsx
        │   └── AdminDashboard.jsx
        ├── App.jsx
        ├── App.css
        └── main.jsx

```

---

## 🚀 10. Local Setup & Installation Guide

### Prerequisites Check

Before proceeding, verify that your local environment meets the following requirements:

* **Node.js**: Version 18.0.0 or higher (`node -v`).
* **npm**: Node Package Manager (`npm -v`).
* **MongoDB Community Server**: Installed and running locally on port `27017` (`mongod`).

---

### Step 1: Clone or Initialize Repository

```bash
git clone [https://github.com/your-username/home-away.git](https://github.com/your-username/home-away.git)
cd home-away

```

---

### Step 2: Configure and Boot the Backend Server

1. Navigate to the backend directory:
```bash
cd backend

```


2. Install dependencies:
```bash
npm install

```


3. Create a `.env` file in the `backend/` root folder with these variables:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/homeaway
JWT_SECRET=supersecret_homeaway_jwt_key_2026

```


4. Start the backend service with live-reload support:
```bash
npm run dev

```


* *Verification:* Ensure your console outputs `🚀 Home Away Server running locally at http://localhost:5000` and `✅ MongoDB Connected Successfully`.



---

### Step 3: Configure and Boot the Frontend Client

1. Open a **new terminal tab or window** and navigate to the frontend directory:
```bash
cd frontend

```


2. Install frontend packages:
```bash
npm install

```


3. (Optional) Create a `.env` file inside `frontend/` if overriding the API gateway URL:
```env
VITE_API_BASE_URL=http://localhost:5000

```


4. Start the Vite development server:
```bash
npm run dev

```


* *Verification:* Vite will output your local client access URL (typically `http://localhost:5173`). Open this URL in your web browser.



---

## 🔒 11. Security & Authentication Architecture

* **Stateless Authorization Tokens:** Authentication is handled using cryptographically signed JSON Web Tokens (JWT). Upon successful login or registration, the server issues a token which the client includes in subsequent requests via the `Authorization: Bearer <token>` HTTP header.
* **Cryptographic Hashing:** User passwords are never stored in plaintext. They undergo salted hashing using `bcryptjs` configured with an optimal work factor ($10$ rounds) prior to database persistence.
* **Role Verification Middleware:** Custom Express middleware (`authMiddleware.js`) intercepts protected routes to validate JWT integrity, parse user payload metadata, and enforce strict role checking (`guest` vs `admin`) before permitting controller execution.

---

## 📈 12. Operational Workflows & Sequences

### 1. Booking & Payment Execution Workflow

1. **Discovery & Filtering:** The guest navigates the React client, filtering rooms by category and maximum nightly budget.
2. **Checkout Intent:** The user selects a desired room and clicks **Book Room**, invoking the secure checkout payment modal.
3. **Parameter Capture:** The guest inputs stay date intervals and simulated payment credentials.
4. **Persistence & Confirmation:** The frontend dispatches an authenticated `POST` request to `/api/bookings`. The backend validates availability, calculates total costs, persists the record, and returns a confirmation payload.

### 2. Administrative Housekeeping Workflow

1. **Console Authentication:** An administrator logs in using credentials mapped to the `admin` role.
2. **Operational Inspection:** The administrator accesses the **Admin Console** tab to view real-time housekeeping indicators across all physical assets.
3. **State Mutation:** The staff member selects a new status (`Clean` ➔ `Dirty` ➔ `Maintenance`), triggering an instant `PATCH` request to update the database record.

---

## 🧪 13. Testing, Quality Assurance, & Validation

To ensure production resilience, developers can evaluate system integrity through structured testing methodologies:

* **API Unit Testing:** Validate Express endpoints using tools like Postman or cURL against the health check endpoint (`GET /`).
* **Component Verification:** Ensure React state hooks handle edge cases such as empty search results, expired tokens, and invalid date ranges gracefully.
* **Database Constraints:** Verify that Mongoose schemas enforce required fields, type casting, and unique email constraints correctly.

---

## 🗺️ 14. Scalability & Future Roadmap

* [ ] **Stripe Production Integration:** Replace the simulated payment modal with actual Stripe Checkout sessions and webhook listeners.
* [ ] **Automated Notifications:** Integrate SendGrid and Twilio for automated email and SMS reservation confirmations.
* [ ] **Redis Caching Layer:** Implement Redis to cache room availability bitmaps and accelerate high-frequency search queries.
* [ ] **Multi-Property Tenancy:** Expand database schemas to support isolated enterprise tenant management.

---

## 📜 15. License & Governance

This project is open-source software licensed under the [MIT License](https://www.google.com/search?q=LICENSE). Contributions, bug reports, and feature requests are welcome via GitHub issues and pull requests.

```

```
