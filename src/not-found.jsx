/**
 * Entry point for the 404 page (404.html).
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import NotFound from './pages/NotFound.jsx';
import './styles/fonts.js';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotFound />
  </StrictMode>,
);
