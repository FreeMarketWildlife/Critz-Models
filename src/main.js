import { WeaponDisplayApp } from './app/WeaponDisplayApp.js';
import { initializeKeywordTooltips } from './utils/keywordTooltips.js';

const bootstrap = () => {
  const root = document.getElementById('app');

  if (!root) {
    throw new Error('App root element not found. Ensure #app exists in index.html');
  }

  initializeKeywordTooltips();
  const app = new WeaponDisplayApp(root);
  app.init();
};

document.addEventListener('DOMContentLoaded', bootstrap);
