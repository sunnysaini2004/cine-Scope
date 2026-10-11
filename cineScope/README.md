# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# Movie Search React App

A modern movie search application built with **React** and **Vite**. This project demonstrates my skills in React, API integration, state management, component design, and responsive UI using Tailwind CSS.

## Features

- 🔍 **Search Movies:** Search for movies using the TMDB API with debounced input for performance.
- 🎬 **Popular Movies:** Displays a list of trending/popular movies by default.
- ⚡ **Fast & Modern Stack:** Built with React 19, Vite, and Tailwind CSS for rapid development and a great developer experience.
- 🧩 **Reusable Components:** Modular components for search, movie cards, and loading spinners.
- 📱 **Responsive Design:** Fully responsive layout for mobile and desktop.
- 🌙 **Dark Theme:** Uses a dark color palette for a modern look.
- 🛠️ **ESLint & Best Practices:** Linting and code quality enforced with ESLint and recommended React rules.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TMDB API](https://www.themoviedb.org/documentation/api)
- [ESLint](https://eslint.org/)

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/movie-search-react-app.git
   cd movie-search-react-app
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local` and add your TMDB API key:
     ```
     VITE_TMDB_API_KEY=your_tmdb_api_key_here
     ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```

5. **Build for production:**
   ```sh
   npm run build
   ```

## Project Structure

- `src/components/` – Reusable React components (MovieCard, Search, Spinner)
- `src/assets/` – Static assets
- `src/App.jsx` – Main app logic
- `src/main.jsx` – Entry point
- `src/index.css` – Tailwind and global styles

## Example Bullet Points

- This project demonstrates:
  - API integration and data fetching in React
  - Debounced search input for better UX
  - Component-driven development and state management
  - Styling with Tailwind CSS
  - Fast development workflow with Vite

## What I Learned

- Efficient API data fetching and error handling in React
- Debouncing user input for better UX
- Component-driven development and state management
- Styling with Tailwind CSS and custom utility classes
- Using Vite for fast development and builds

## Contact

If you’d like to discuss this project or opportunities, feel free to reach out via [LinkedIn](https://www.linkedin.com/in/tinesh-narendra-shah/) or email me at [tineshshah87@gmail.com](mailto:tineshshah87@gmail.com).

---
