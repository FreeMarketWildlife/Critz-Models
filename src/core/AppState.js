export class AppState {
  constructor() {
    this.categories = [];
    this.activeCategoryId = null;
    this.activeWeaponId = null;
  }

  setCategories(categories) {
    this.categories = Array.isArray(categories) ? categories : [];
  }

  setActiveCategory(categoryId) {
    this.activeCategoryId = categoryId;
  }

  setActiveWeapon(weaponId) {
    this.activeWeaponId = weaponId;
  }

  getActiveCategory() {
    return this.categories.find((category) => category.id === this.activeCategoryId) || null;
  }

  getActiveWeapon() {
    const category = this.getActiveCategory();
    if (!category || !Array.isArray(category.weapons)) {
      return null;
    }
    return category.weapons.find((weapon) => weapon.id === this.activeWeaponId) || null;
  }
}
