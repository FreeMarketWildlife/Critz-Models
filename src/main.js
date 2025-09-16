import App from './core/app.js';
import { categories, DEFAULT_CATEGORY_ID } from './config/categories.js';
import sampleWeapons from './data/sampleWeapons.js';

const boot = () => {
  const root = document.getElementById('app');
  if (!root) {
    console.error('App root element not found.');
    return;
  }

  const app = new App({
    root,
    categories,
    weapons: sampleWeapons,
    defaultCategory: DEFAULT_CATEGORY_ID,
  });

  app.init();
};

document.addEventListener('DOMContentLoaded', boot);
