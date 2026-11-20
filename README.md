# 💗 Coy Discover

A swipe-based profile discovery and matching experience inspired by Coy, built with Next.js, TypeScript, Framer Motion, and Supabase.

Coy Discover allows users to explore profiles, express interest through likes or passes, and discover mutual connections through an interactive matching experience.

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
git clone YOUR_GITHUB_REPOSITORY_URL
cd coy-discover
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

Replace the placeholder values with your Supabase project credentials.

**Important:** Keep your service-role key private. Never commit `.env.local` or expose this key in frontend code.

### 4. Configure Supabase

Create a Supabase project and configure the PostgreSQL database with the following tables:

- `profiles`
- `swipes`
- `matches`

The database should contain the demo user, mock profiles, and initial incoming likes required for testing the matching functionality.

### 5. Run the development server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

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

**Possible response:**

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

## 🧪 Production Build

To verify the production build:

```bash
npm run build
```

## 🔒 Security

- Supabase service-role credentials are stored in server-side environment variables.
- Environment files are excluded through `.gitignore`.
- Database access is performed through server-side API routes.
- No external authentication setup is required for this demo; a predefined demo user is used.

## 👨‍💻 Author

**Vivek Chandra Arya**

vivek.arya.works@gmail.com