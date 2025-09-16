export function createAppLayout(root) {
  root.classList.add('app-root');
  root.innerHTML = `
    <div class="app-shell">
      <header class="hud" data-component="hud"></header>
      <main class="workspace">
        <section class="viewer-pane">
          <div class="viewer-frame">
            <div class="viewer-canvas" data-element="viewer"></div>
            <div class="viewer-overlay" data-element="viewer-status">
              <h2>Arcane Forge</h2>
              <p>Summon a weapon to witness its form.</p>
            </div>
          </div>
        </section>
        <aside class="codex-pane">
          <div class="codex">
            <div class="codex-header">
              <h2 class="codex-title" data-element="category-title">Armory</h2>
              <p class="codex-description" data-element="category-description">
                Explore the arsenal of Critz and attune each weapon to the forge.
              </p>
            </div>
            <div class="codex-body">
              <div class="weapon-list" data-element="weapon-list"></div>
              <div class="weapon-detail" data-element="weapon-detail">
                <p class="weapon-detail__placeholder">Select a weapon to reveal its story and statistics.</p>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  `;

  return {
    hud: root.querySelector('[data-component="hud"]'),
    viewerContainer: root.querySelector('[data-element="viewer"]'),
    viewerStatus: root.querySelector('[data-element="viewer-status"]'),
    categoryTitle: root.querySelector('[data-element="category-title"]'),
    categoryDescription: root.querySelector('[data-element="category-description"]'),
    weaponList: root.querySelector('[data-element="weapon-list"]'),
    weaponDetail: root.querySelector('[data-element="weapon-detail"]'),
  };
}
