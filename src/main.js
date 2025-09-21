import { WeaponDisplayApp } from './app/WeaponDisplayApp.js';
import { initializeTooltipManager } from './utils/tooltipManager.js';

const bootstrap = () => {
  const root = document.getElementById('app');

  if (!root) {
    throw new Error('App root element not found. Ensure #app exists in index.html');
  }

  const app = new WeaponDisplayApp(root);
  app.init();
  initializeTooltipManager();
};

document.addEventListener('DOMContentLoaded', bootstrap);
