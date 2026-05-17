# alumnext

**What it does:** 
AlumNext is a centralized networking and collaboration platform designed exclusively for educational institutions. It bridges the gap between verified Alumni, Current Students, and the Training & Placement (T&P) Cell.

**Real-world problem it solves:** 
Colleges struggle to maintain active relationships with alumni. Students lack direct access to alumni for mentorship or referrals. T&P cells rely on fragmented systems (WhatsApp, emails, spreadsheets) to track placements, referrals, and alumni networks. AlumNext solves this by creating a secure, verified, single-source-of-truth platform.

**Main Users & Roles:**
- **Students:** Seek mentorship, view job postings/referrals, network with seniors.
- **Alumni:** Post job openings, mentor students, share experiences via posts.
- **Admin (T&P Cell):** Approves users (gatekeeping unauthorized access), verifies job postings, oversees the platform.

**Why it is useful:** 
It brings accountability, security, and structure to college networking. Features like role-based rendering ensure data privacy (students can't falsely claim alumni status until verified by admin).

---

## 2. Full Tech Stack Explanation

The project utilizes the **PERN stack** (PostgreSQL, Express, React, Node.js) with modern tooling for security and speed.

### Frontend
- **React & Vite:** React builds dynamic UIs. Vite is the bundler—chosen over Create React App because it uses native ES modules, making local server startup and Hot Module Replacement (HMR) lightning fast.
- **Tailwind CSS:** Utility-first CSS framework. It allows rapidly building modern, responsive designs without leaving the JSX file.
- **React Router (v6):** Handles client-side routing, enabling a Single Page Application (SPA) feel (no page reloads between dashboards).
- **Axios:** Handles HTTP requests to the backend. It automatically parses JSON and allows us to easily attach JWT tokens using interceptors.
- **Zustand / Context API:** Used for state management (keeping track of the logged-in user's session without prop-drilling).
- **UI Libraries:** Recharts (for admin graphs), Lucide-React (icons).

### Backend
- **Node.js & Express.js:** Node provides the JavaScript runtime server-side. Express is a minimal routing framework that handles our API endpoints and HTTP requests.
- **Prisma ORM:** Object-Relational Mapper. Instead of writing raw SQL strings, Prisma allows interacting with the database using type-safe JavaScript methods.
- **JWT (JSON Web Tokens):** Stateless authentication. When a user logs in, they get a crypto-signed token to prove their identity on subsequent requests without querying the DB every time.
- **Role-based Access Control (RBAC):** Middleware checks if a user is `STUDENT`, `ALUMNI`, or `ADMIN` before allowing certain actions.

### Database & Cloud
- **Supabase (PostgreSQL):** A fully managed PostgreSQL database in the cloud. It naturally handles large relational data safely.
- **Cloudinary:** Cloud-based image management. Instead of saving profile pictures / post images to our own server (which kills storage), we upload them to Cloudinary and just save the secure URL in our database.
- **Vercel (Frontend):** Highly optimized CDN deployment for React applications.
- **Render (Backend):** Deploys the Node.js API server natively.
- **Brevo (SMTP):** Used to send transactional emails (registration success, mentorship requests) reliably without ending up in spam.

---
