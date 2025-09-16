import { createAppLayout } from './components/layout.js';
import { initializeHud } from './components/hud.js';
import { initializeWeaponBrowser } from './components/weaponBrowser.js';
import { initializeWeaponDetail } from './components/weaponDetail.js';
import { loadWeaponRegistry } from './data/weaponRegistry.js';
import { initializeWeaponState, bootstrapWeaponState } from './state/weaponState.js';
import { initializeViewer } from './three/viewer.js';

const registry = loadWeaponRegistry();
initializeWeaponState(registry);

const appRoot = document.getElementById('app');
const layout = createAppLayout(appRoot);

initializeHud(layout.hud);
initializeWeaponBrowser({
  titleElement: layout.categoryTitle,
  descriptionElement: layout.categoryDescription,
  listElement: layout.weaponList,
});
initializeWeaponDetail(layout.weaponDetail);
initializeViewer(layout.viewerContainer, layout.viewerStatus);

bootstrapWeaponState();
