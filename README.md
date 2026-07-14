# Tech Bazaar 🚀

Tech Bazaar is a premium, modern marketplace for buying and selling electronics. This platform connects buyers looking for top-tier gadgets with verified sellers, facilitating seamless hardware transactions with Stripe escrow payments, powerful analytics, and role-based dashboards.

## ✨ Features

- **Role-Based Access:** Distinct experiences for Buyers, Sellers, and Admins.
- **Dynamic Dashboards:** Real-time metrics powered by Recharts (views, inventory value, category distributions).
- **Secure Payments:** Fully integrated Stripe checkout for subscription upgrades and hardware purchases.
- **Responsive UI:** A stunning glassmorphism design with Tailwind CSS, Lucide icons, and micro-animations.
- **Robust Auth:** Authentication and session management powered by Better Auth.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Recharts
- **Backend:** Node.js, Express, TypeScript, MongoDB
- **Authentication:** Better Auth (Google OAuth & Credentials)
- **Payments:** Stripe API
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Cluster
- Stripe Account

### Local Development

1. **Clone and Install:**
   ```bash
   # Install frontend dependencies
   cd tech-bazaar-starter-client
   npm install

   # Install backend dependencies
   cd ../tech-bazaar-starter-server
   npm install
   ```

2. **Environment Variables:**
   Set up your `.env` files based on the `.env.example` templates in both the client and server directories.
   
3. **Run the Development Servers:**
   ```bash
   # In terminal 1 (Backend)
   cd tech-bazaar-starter-server
   npm run dev

   # In terminal 2 (Frontend)
   cd tech-bazaar-starter-client
   npm run dev
   ```

## 🛡️ Admin & Seller Management

- **Admins** have platform-wide oversight. They can view total users, platform listings, and aggregate value.
- **Sellers** can manage their own listings, view reach, and track total inventory worth.
- Upgrade to a Seller tier from the Pricing page to start listing gadgets!

---
*Built for the ultimate hardware exchange experience.*
