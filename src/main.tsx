import '@/styles/index.css';
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';

const theme = localStorage.getItem("theme");

if (!theme || theme === "dark") {
  document.documentElement.classList.add("dark");

  localStorage.setItem("theme", "dark");
}

createRoot(document.getElementById('root')!).render(
  <App />
)
