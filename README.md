# Ustaad (Homehire)

Ustaad is a home-services marketplace prototype. Customers can describe a job and compare provider quotes; service providers can set up a profile, respond to relevant requests, and manage bookings. The current application is branded “Homehire” in several screens.

## Features

- Customer and provider registration with phone OTP verification, plus phone/password login.
- Role-protected customer and provider areas.
- Provider profiles with service categories, rates, experience, service area, and optional uploads.
- Customer provider discovery, provider profiles, and direct or open service requests.
- Provider request matching and quote submission; customers can review and accept quotes.
- Booking lists and booking progress updates, with customer notifications for completion requests.
- Customer profile, address, and password management.

## Tech stack

- **Frontend:** React 19, React Router, Vite, Tailwind CSS 4, and Lucide icons.
- **Backend:** Node.js, Express 5, Mongoose, and MongoDB.
- **Authentication:** JWT bearer tokens; passwords are hashed with bcrypt.
- **Uploads:** Multer writes uploaded files to the server's local `upload/` directory.

## Repository layout

```text
frontend/   React/Vite application
server/     Express API, MongoDB models, routes, and seed script
```

## Prerequisites

- Node.js and npm (use a Node.js version supported by Vite 8).
- A running MongoDB instance or an accessible MongoDB connection string.

## Local development

### 1. Configure and start the API

Create `server/.env` with your local MongoDB URI and a private JWT signing secret:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/Homehire
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
```

Ensure `server/upload/` exists before starting the API; the current Multer configuration expects that local directory for uploaded files.

From the repository root:

```bash
cd server
npm install
npm run seed:categories
npm run dev
```
The API listens on `http://localhost:5000`. The category seed command inserts or updates the initial categories: Electrician, Plumber, AC Technician, Appliance Repair, and Carpenter.
The API listens on `http://localhost:5000`. The category seed command inserts or updates the initial categories: Electrician, Plumber, AC Technician, Appliance Repair, and Carpenter.

### 2. Start the frontend

In a second terminal, from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The frontend currently calls the API at `http://127.0.0.1:5000` (some requests use `localhost`); update those API URLs before using a remote backend.

### Other frontend commands

Run these from `frontend/`:

```bash
npm run build
npm run preview
npm run lint
```

The backend package currently provides `npm start`, `npm run dev`, and `npm run seed:categories`; it does not define a test script.

## API overview

All routes are mounted under `/api`. Protected endpoints use `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/send-otp` | Public | Start customer/provider registration |
| `POST` | `/auth/verify-otp` | Public | Verify OTP and create an account |
| `POST` | `/auth/login` | Public | Log in and receive a JWT |
| `GET` | `/categories/` | Public | List service categories |
| `GET` | `/provider/search` | Public | Search providers |
| `POST` | `/provider/profile` | Provider | Create provider profile |
| `GET` | `/provider/profile/me` | Provider | Read provider profile |
| `PUT` | `/provider/profile/me` | Authenticated | Update provider profile |
| `GET` | `/customerhome/providers` | Customer | Browse providers; optional `category` query |
| `GET` | `/customerhome/providerprofile/:id` | Customer | Read a provider profile by provider user ID |
| `GET` | `/customer/profile/me` | Customer | Read customer details and address |
| `PUT` | `/customer/profile/me` | Customer | Update customer details |
| `PUT` | `/customer/profile/me/addresses` | Customer | Save customer address |
| `PUT` | `/customer/profile/me/password` | Customer | Change customer password |
| `POST` | `/requests/openarequest` | Customer | Create a service request |
| `GET` | `/requests/my` | Customer | List the customer's requests |
| `GET` | `/requests/open` | Provider | List requests matched to the provider |
| `GET` | `/requests/:id/quotes` | Customer | List quotes for a request |
| `DELETE` | `/requests/:id/delete` | Customer | Delete a request |
| `POST` | `/quotes/` | Provider | Submit a quote |
| `PUT` | `/quotes/:id/accept` | Customer | Accept a quote and create a booking |
| `GET` | `/bookings/my` | Customer/provider | List the caller's bookings |
| `PUT` | `/bookings/:id/status` | Provider | Advance a booking's status |
| `GET` | `/notifications/my` | Customer | List the caller's notifications |
| `PUT` | `/notifications/:notificationId/respond` | Customer | Respond to a completion notification |

## Current limitations

- OTP delivery is not connected to an SMS provider: the API logs the code and returns it as `devOtp`. This is for local development only and must be replaced before deployment.
- Frontend API URLs are hard-coded to a local server; there is no frontend API-base environment setting yet.
- Customer and provider dashboards contain sample/static figures and activity in addition to live data.
- The customer/provider messaging pages and provider quotes page are placeholders; no chat API is currently registered.
- Uploaded files are stored on local disk. Configure suitable persistent/private storage before deploying.
- Provider discovery endpoints apply inconsistent verification filters, and there is no admin verification workflow. Do not treat the current discovery results as proof that providers have been verified.
- There is no payment integration, despite payment-related marketing copy on the landing page. The quote acceptance UI also needs error-handling work before its success message can be relied on.
- The backend has no admin routes wired into the server and no automated test script in its package manifest.

## Notes

- Do not commit `server/.env`, production credentials, or uploaded user files.
- The backend listens on port `5000`; changing that port also requires updating the frontend API URLs.
