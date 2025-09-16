import { getCategoryById } from '../config/categories.js';

export default class WeaponRegistry {
  constructor({ schema, weapons = [], categories = [] } = {}) {
    this.schema = schema;
    this.categories = categories;
    this.weapons = [];
    this.weaponMap = new Map();

    weapons.forEach((weapon) => this.registerWeapon(weapon));
  }

  registerWeapon(weapon) {
    if (!weapon || !weapon.core) {
      console.warn('Attempted to register invalid weapon payload:', weapon);
      return;
    }

    if (!weapon.core.slug) {
      console.warn('Weapon missing slug, skipping registration:', weapon);
      return;
    }

    this.weaponMap.set(weapon.core.slug, weapon);
    const existingIndex = this.weapons.findIndex((item) => item.core.slug === weapon.core.slug);
    if (existingIndex >= 0) {
      this.weapons.splice(existingIndex, 1, weapon);
    } else {
      this.weapons.push(weapon);
    }
  }

  listCategories() {
    return this.categories;
  }

  getCategoryMeta(categoryId) {
    return getCategoryById(categoryId);
  }

  getWeaponsByCategory(categoryId) {
    return this.weapons.filter((weapon) => weapon.core.category === categoryId);
  }

  getWeaponBySlug(slug) {
    return this.weaponMap.get(slug) || null;
  }

  getFirstWeaponInCategory(categoryId) {
    const [first] = this.getWeaponsByCategory(categoryId);
    return first || null;
  }

  toJSON() {
    return this.weapons;
  }
}
