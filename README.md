 🔐 SecureSight

SecureSight is a camera-based incident monitoring system built with modern web technologies. It helps teams easily visualize, group, and resolve incidents from multiple surveillance cameras—all in a clean, fast, and responsive interface.

It's lightweight, scalable, and designed to make security operations smoother and more intelligent.

---

⚙️ Updated Tech Decisions

| Layer      | Tech Used                                         | Why It's Used                                           |
| ---------- | ------------------------------------------------- | ------------------------------------------------------- |
| Frontend   | Next.js 15 with React 19 + TypeScript | Fullstack, typed, modern                                |
| State Mgmt | React Context API                             | Global state for selected incidents, filters, etc.      |
| Styling    | Tailwind CSS                                  | Utility-first responsive styling                        |
| Icons      | Lucide React                                  | Clean SVG icon set                                      |
| ORM        | Prisma                                        | Type-safe database schema and queries                   |
| Database   | PostgreSQL                                    | Structured, scalable DB for incident data               |
| Runtime    | tsx                                           | Run TypeScript scripts (e.g. seeding) without compiling |
| Deployment | Vercel / Render                           | Simple and fast CI/CD for fullstack apps                |

 ✨ Key Features

 🧠 Timeline Events Grouping by Time

* All incidents are displayed on a horizontal timeline and grouped by their timestamp proximity.
* This helps users identify clusters of activity quickly and scroll through historical data seamlessly.

 📷 Camera-Wise Event Distribution

* Incidents are grouped by camera ID so you can easily see which cameras are more "active".
* Helps with identifying frequently triggered or potentially faulty cameras.

 🖼 Thumbnail Optimization

* To keep the UI clean and prevent information overload, only two thumbnails (max) are shown per incident group.
* This gives users just enough visual context without overwhelming the layout.

✅ Resolvable Incidents

* Incidents can be marked as resolved, helping users track which events still require action.
* Resolved items are visually styled differently and saved with status updates in the DB.

 🔄 Auto-Updating Live Incidents (Polling)
SecureSight includes a smart auto-refresh mechanism that ensures users see the latest incident data without needing to manually refresh the page.
---
 🚀 How to Run SecureSight

> Built and tested with Node 18+ and npm 9+

 1. Clone the Repo

```bash
git clone https://github.com/Akash4701/SecureSight.git
cd SecureSight
```

 2. Install Dependencies

```bash
npm install
```

 3. Set up your `.env` file

```env
DATABASE_URL=postgresql://username:password@host:port/dbname
```

> You can also copy from `.env.example` (if added)

### 4. Set up Database

```bash
npm run setup
```

This runs:

* `prisma db push` (to sync the schema)
* `tsx prisma/seed.ts` (to populate some sample data)

### 5. Start Dev Server

```bash
npm run dev
```

Now open [http://localhost:3000](http://localhost:3000) in your browser!

 ⏳ If I Had More Time…

Here’s what I would add next to take SecureSight to the next level:

* 🔐 Authentication system (role-based login for security teams)
* 🔄 Socket.IO integration for live incident updates as they occur
* 🔍 Advanced filters (priority, tags, zones, custom ranges)
* 🧠 AI-based anomaly detection using pre-trained vision models on thumbnails or live feeds
* 🎛 Admin dashboard for system-level monitoring
