import { App } from './app/App.js';

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Failed to find application root element.');
}

const app = new App(rootElement);
app.init();
