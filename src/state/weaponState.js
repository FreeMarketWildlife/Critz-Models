import { eventBus } from '../utils/eventBus.js';

const state = {
  categories: [],
  weaponsByCategory: new Map(),
  selectedCategoryId: null,
  selectedWeaponId: null,
};

export function initializeWeaponState({ categories = [], weapons = [] }) {
  state.categories = categories.map((category) => ({ ...category }));
  state.weaponsByCategory = new Map();

  state.categories.forEach((category) => {
    state.weaponsByCategory.set(category.id, []);
  });

  weapons.forEach((weapon) => {
    const entry = {
      ...weapon,
      stats: { ...(weapon.stats ?? {}) },
      metadata: { ...(weapon.metadata ?? {}) },
      traits: Array.isArray(weapon.traits) ? [...weapon.traits] : [],
    };
    const bucket = state.weaponsByCategory.get(entry.category) ?? [];
    bucket.push(entry);
    state.weaponsByCategory.set(entry.category, bucket);
  });

  if (state.categories.length > 0) {
    state.selectedCategoryId = state.categories[0].id;
    const firstWeapon = getWeaponsForCategory(state.selectedCategoryId)[0];
    state.selectedWeaponId = firstWeapon ? firstWeapon.id : null;
  } else {
    state.selectedCategoryId = null;
    state.selectedWeaponId = null;
  }
}

export function bootstrapWeaponState() {
  eventBus.emit('registry:ready', {
    categories: getCategories(),
  });

  if (state.selectedCategoryId) {
    eventBus.emit('category:changed', {
      categoryId: state.selectedCategoryId,
      category: getCurrentCategory(),
    });
  }

  eventBus.emit('weapon:changed', {
    weaponId: state.selectedWeaponId,
    weapon: getCurrentWeapon(),
  });
}

export function getCategories() {
  return state.categories;
}

export function getSelectedCategoryId() {
  return state.selectedCategoryId;
}

export function getSelectedWeaponId() {
  return state.selectedWeaponId;
}

export function getCurrentCategory() {
  if (!state.selectedCategoryId) {
    return null;
  }
  return state.categories.find((category) => category.id === state.selectedCategoryId) ?? null;
}

export function getCurrentWeapon() {
  if (!state.selectedCategoryId || !state.selectedWeaponId) {
    return null;
  }
  const weapons = getWeaponsForCategory(state.selectedCategoryId);
  return weapons.find((weapon) => weapon.id === state.selectedWeaponId) ?? null;
}

export function getWeaponsForCategory(categoryId) {
  return state.weaponsByCategory.get(categoryId) ?? [];
}

export function setSelectedCategory(categoryId) {
  if (!categoryId || categoryId === state.selectedCategoryId) {
    return;
  }

  const categoryExists = state.categories.some((category) => category.id === categoryId);
  if (!categoryExists) {
    console.warn(`Category ${categoryId} does not exist in registry.`);
    return;
  }

  state.selectedCategoryId = categoryId;
  const weapons = getWeaponsForCategory(categoryId);
  state.selectedWeaponId = weapons.length > 0 ? weapons[0].id : null;

  eventBus.emit('category:changed', {
    categoryId,
    category: getCurrentCategory(),
  });

  eventBus.emit('weapon:changed', {
    weaponId: state.selectedWeaponId,
    weapon: getCurrentWeapon(),
  });
}

export function setSelectedWeapon(weaponId) {
  if (!weaponId || weaponId === state.selectedWeaponId) {
    return;
  }

  const weapons = getWeaponsForCategory(state.selectedCategoryId);
  const weaponExists = weapons.some((weapon) => weapon.id === weaponId);

  if (!weaponExists) {
    console.warn(`Weapon ${weaponId} not found in current category.`);
    return;
  }

  state.selectedWeaponId = weaponId;
  eventBus.emit('weapon:changed', {
    weaponId,
    weapon: getCurrentWeapon(),
  });
}
