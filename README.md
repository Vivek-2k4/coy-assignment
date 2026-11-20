# 💗 Coy Discover

A swipe-based profile discovery and matching experience inspired by Coy, built with Next.js, TypeScript, Framer Motion, and Supabase.

Coy Discover allows users to explore profiles, express interest through likes or passes, and discover mutual connections through an interactive matching experience.

🌐 **Live Demo:** [https://coy-connect.vercel.app](https://coy-connect.vercel.app)  
💻 **GitHub Repository:** [https://github.com/Vivek-2k4/coy-assignment](https://github.com/Vivek-2k4/coy-assignment)

---

## ✨ Features

- **Profile Discovery:** Explore 30 mock profiles with details including name, age, bio, city, college, and interests.
- **Swipe Interactions:** Like or pass on profiles using interactive buttons and drag gestures.
- **Smooth Animations:** Animated card transitions and clear LIKE/PASS feedback.
- **Mutual Matching:** A match is created only when both users have liked each other.
- **Match Celebration:** An animated "It's a Match!" popup celebrates successful mutual matches.
- **Matches Dashboard:** View all mutual matches in one place.
- **Persistent Data:** Swipe history and matches are stored in Supabase and remain available after refreshing or restarting the application.
- **Responsive Design:** Optimised for desktop and mobile screens.
- **Empty States:** Helpful UI when no more profiles or matches are available.

## 🛠️ Tech Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

**Backend**
- Next.js API Routes
- Node.js

**Database**
- Supabase (PostgreSQL)

**Deployment**
- Vercel
- GitHub

## 📁 Project Structure

```text
coy-discover/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── feed/
│   │   │   │   └── route.ts
│   │   │   ├── swipe/
│   │   │   │   └── route.ts
│   │   │   └── matches/
│   │   │       └── route.ts
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── ProfileCard.tsx
│   └── lib/
│       └── supabaseAdmin.ts
├── public/
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm
- A Supabase account

### 1. Clone the repository

```bash
git clone https://github.com/Vivek-2k4/coy-assignment.git
cd coy-assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Replace the placeholder values with your own Supabase project credentials.

**Important:** Keep your service-role key private. Never commit `.env.local` or expose this key in frontend code.

### 4. Configure Supabase

Create a Supabase project and configure the PostgreSQL database with the following tables in the `public` schema:

- `profiles`
- `swipes`
- `matches`

The database must contain:
- A predefined demo user.
- 30 mock user profiles.
- Initial incoming likes for the demo user.

Enable Row Level Security and configure the appropriate server-side database access.

The demo data must be seeded before running the application.

### 5. Run the development server

```bash
npm run dev
```

Open your browser and visit:

http://localhost:3000

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/feed` | Fetches profiles that the demo user has not swiped on. |
| POST | `/api/swipe` | Records a like or pass and checks for mutual matches. |
| GET | `/api/matches` | Retrieves all mutual matches for the demo user. |

### Swipe API Example

**Request:**

```json
{
  "targetId": "PROFILE_UUID",
  "direction": "like"
}
```

**Example successful match response:**

```json
{
  "success": true,
  "matched": true,
  "message": "It's a Match!",
  "profile": {
    "id": "PROFILE_UUID",
    "name": "Aanya Sharma"
  }
}
```

## 💡 Matching Logic

The application follows a mutual-interest matching system:

1. A user likes or passes on a profile.
2. The swipe action is saved in the database.
3. If the user likes a profile, the backend checks whether that profile has already liked the user.
4. If both users have liked each other, a mutual match is created.
5. The match is saved in the database and displayed in the Matches section.

One-sided likes are never displayed as mutual matches.

## 🧪 Demo Account & Testing Guide

The live application comes with a predefined, pre-authenticated demo account. **No signup or login is required.**

### Demo User ID

```text
00000000-0000-0000-0000-000000000001
```

### Pre-seeded Incoming Likes

The following eight mock profiles have already liked the demo user:

| No. | Name | Handle |
|---|---|---|
| 1 | Aanya Sharma | `aanya_sharma` |
| 2 | Arjun Kapoor | `arjun_kapoor` |
| 3 | Sana Khan | `sana_khan` |
| 4 | Vivaan Bansal | `vivaan_bansal` |
| 5 | Kavya Shah | `kavya_shah` |
| 6 | Zoya Ali | `zoya_ali` |
| 7 | Diya Bhatia | `diya_bhatia` |
| 8 | Kiara Menon | `kiara_menon` |

### How to Test the Matching Experience

1. Open the [Coy Discover live demo](https://coy-connect.vercel.app/).
2. Navigate to the Discover section.
3. Browse the available profiles.
4. Like any of the eight profiles listed above.
5. Since that profile has already liked the demo user, a mutual match should be created.
6. Observe the animated **"It's a Match!"** celebration.
7. Navigate to the Matches section to view the matched profile.
8. Refresh the application to verify that the match persists.

### Important Note About Demo Data

The application uses a single shared demo account and a shared Supabase database, as permitted by the assignment's single-user demo assumption.

Consequently:
- Swipes and matches are persisted across visitors and devices.
- A profile that has already been swiped on will not reappear in the feed.
- Incoming likes are stored independently of the demo user's outgoing swipes.
- Database changes are reflected for all visitors.

For the best initial testing experience, use the pre-seeded incoming likes listed above.

## 🧪 Production Build

To verify the production build:

```bash
npm run build
```

The application is deployed on Vercel and uses Supabase as its persistent database.

## 🔒 Security

- Supabase service-role credentials are stored in server-side environment variables.
- Environment files are excluded through `.gitignore`.
- Database access is performed through server-side API routes.
- No external authentication setup is required for this demo; a predefined demo user is used.

## 👨‍💻 Author

**Vivek Chandra Arya**

B.Tech in Electronics and Communication Engineering (AI & ML)  
Netaji Subhas University of Technology (NSUT), 2026

📧 Email: vivek.arya.works@gmail.com  
🐙 GitHub: [Vivek-2k4](https://github.com/Vivek-2k4)

---

Built with ❤️ as part of the Coy assignment.