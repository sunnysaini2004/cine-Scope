# 🎬 CineScope — Discover Movies You Love

CineScope is a cinematic movie-discovery web app built with React. Explore popular movies, search for films, view detailed movie information, and save titles to your personal watchlist.

<p align="center">
  <a href="https://cine-scope-jet.vercel.app/">🌐 Live Demo</a> ·
  <a href="https://github.com/sunnysaini2004/cine-Scope">💻 GitHub Repository</a>
</p>

## ✨ Features

- **Discover popular movies** using data from The Movie Database (TMDB).
- **Search movies** with a debounced search input to reduce unnecessary requests.
- **Movie details** including available cast, crew, videos, and images.
- **Personal watchlist** to save and remove movies.
- **Persistent watchlist** stored in the browser with `localStorage`.
- **Sort movie results** by popularity, title, rating, or release date.
- **Loading and error states** for a clearer user experience.
- **Responsive layout** designed for different screen sizes.
- **Cinematic UI** with a charcoal, slate, and ivory color palette.
- **Live deployment** on Vercel, connected to the GitHub repository for automatic deployments.

## 🔗 Project Links

- **Live website:** https://cine-scope-jet.vercel.app/
- **GitHub repository:** https://github.com/sunnysaini2004/cine-Scope
- **Movie data API:** [The Movie Database (TMDB)](https://www.themoviedb.org/)

## 🧰 Tech Stack

- [React](https://react.dev/) — UI components and application state
- [Vite](https://vite.dev/) — development server and production build
- [Tailwind CSS v4](https://tailwindcss.com/) — styling and responsive design
- [TMDB API](https://developer.themoviedb.org/) — movie data and details
- [react-use](https://github.com/streamich/react-use) — debounced search utility
- Browser `localStorage` — watchlist persistence
- [Vercel](https://vercel.com/) — deployment and hosting

## 🚀 Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (a current LTS version is recommended)
- npm
- A TMDB API access token

### 1. Clone the repository

```bash
git clone https://github.com/sunnysaini2004/cine-Scope.git
cd cine-Scope
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the TMDB environment variable

Create a file named `.env.local` in the project root and add your TMDB **API Read Access Token**:

```env
VITE_TMDB_API_KEY=your_tmdb_api_read_access_token
```

Replace the placeholder with your own token. Do not commit `.env.local` or paste your real token into README files, screenshots, or public messages.

> **Security note:** Vite exposes variables prefixed with `VITE_` in the client-side bundle. This setup is suitable for a client-side demo, but the token should not be treated as a private secret. For stronger protection in a production application, route TMDB requests through a backend or serverless function and keep credentials server-side. See the [Vite environment variables guide](https://vite.dev/guide/env-and-mode.html#env-variables).

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal (Vite commonly uses `http://localhost:5173`). If you change environment variables while the server is running, restart the development server.

### 5. Build for production

```bash
npm run build
```

To run the project's lint checks:

```bash
npm run lint
```

## 📁 Project Structure

```text
cine-Scope/
├── public/
│   └── hero.jpg
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── Search.jsx
│   │   └── Spinner.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env.local          # Local environment variable; do not commit
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

The structure above reflects the current project layout; minor file names may differ if the project is updated.

## 🎞️ How It Works

1. CineScope requests popular movies from TMDB when the Discover view loads.
2. Search terms are debounced before a movie search request is made.
3. Selecting a movie loads its additional details.
4. Add movies to your watchlist to keep them saved in your browser.
5. Switch between **Discover Movies** and **My Watchlist**, then sort the displayed results.

## 🌍 Deployment

The project is deployed on Vercel and connected to the GitHub repository. Push changes to the connected production branch (typically `main`) to trigger a new deployment.

Make sure `VITE_TMDB_API_KEY` is configured in the Vercel project's environment variables for the environments you deploy, then redeploy if you change that value.

## 🙋 Author

**Sunny Saini** — developer of CineScope.

- GitHub: [@sunnysaini2004](https://github.com/sunnysaini2004)
- Project repository: [cine-Scope](https://github.com/sunnysaini2004/cine-Scope)
- Live project: [CineScope](https://cine-scope-jet.vercel.app/)

## 🙌 Acknowledgements

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie data and images.
- [React](https://react.dev/), [Vite](https://vite.dev/), and [Tailwind CSS](https://tailwindcss.com/) for the development tools and framework.

Movie data is provided by TMDB. CineScope is an independent portfolio project and is not endorsed or certified by TMDB.
