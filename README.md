# ⚽ Sports Dashboard

A live sports dashboard built with React that pulls real-time data from the API-Football API. Track standings, upcoming fixtures, and top scorers across the top European football leagues.

🔗 **[Live Demo](https://sports-dashboard-nu.vercel.app/)**

![Dashboard Preview](./screenshots/preview.png)

---

## 🚀 Features

- 🏆 **League Standings** — Full table with points, wins, losses, and a bar chart visualization
- 📅 **Fixtures** — Upcoming and recent matches grouped by date
- 🥅 **Top Scorers** — Ranked list with goals, assists, team, and player photos
- 🌍 **League Switcher** — Toggle between Premier League, La Liga, Serie A, and more
- 🌙 **Dark Mode** — Full dark/light theme toggle
- 📱 **Responsive** — Works on mobile and desktop
- ⚡ **Smart Caching** — API responses cached with React Query to avoid rate limit hits
- 💀 **Loading Skeletons** — No jarring spinners; smooth skeleton loaders throughout

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | TailwindCSS |
| Data Fetching | React Query |
| Charts | Recharts |
| Routing | React Router v6 |
| API | [API-Football](https://www.api-football.com/) |
| Deployment | Vercel |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- A free API key from [api-football.com](https://www.api-football.com/)

### Installation

```bash
# Clone the repo
git clone https://github.com/mahmoud-el-melegy/sports-dashboard.git
cd sports-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API key to .env
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_KEY=your_api_football_key_here
VITE_API_BASE_URL=https://v3.football.api-sports.io
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
sports-dashboard/
├── src/
│   ├── components/       # Reusable UI components (Navbar, Skeleton, Charts)
│   ├── pages/            # Standings, Fixtures, TopScorers
│   ├── hooks/            # Custom React Query hooks
│   ├── services/         # Axios API layer
│   └── main.jsx
├── public/
├── .env.example
└── README.md
```

---

## 🌐 Supported Leagues

| League | ID |
|---|---|
| Premier League | 39 |
| La Liga | 140 |
| Serie A | 135 |
| Bundesliga | 78 |
| Ligue 1 | 61 |

---

## 🔌 API Usage

This project uses [API-Football](https://www.api-football.com/) via RapidAPI. The free tier allows **100 requests/day**, which is enough for development. Responses are cached with React Query to minimize unnecessary calls.

Key endpoints used:
- `GET /standings` — League table
- `GET /fixtures` — Match schedule
- `GET /players/topscorers` — Top scorers by league/season

---

## 🚢 Deployment

Deploy instantly to Vercel:

```bash
npm install -g vercel
vercel --prod
```

Add your `VITE_API_KEY` as an environment variable in the Vercel dashboard.

---

## 🗺️ Roadmap

- [ ] Live score updates with polling
- [ ] Team detail page with form guide
- [ ] Player profile pages
- [ ] Search functionality
- [ ] Favorite teams/leagues saved to localStorage

---

## 🤔 Why I Built This

I wanted a project that combines real-time data, data visualization, and a clean UI — all things that matter in a production frontend role. API-Football gave me rich, structured data to work with, and it was a great excuse to get hands-on with React Query's caching strategies and Recharts for dynamic charting.

---

## 📄 License

MIT — feel free to fork and build on this.
