# Critz Armory Display – Technical Plan

## Vision
Create a browser-based weapon display HUD for the world of **Critz** that showcases every equippable item (Primary, Secondary, Melee, Utility). The application must feel arcane and medieval, render 3D models with Three.js, and allow designers to evolve weapon data, stats, and presentation without refactoring core systems.

## Experience Goals
- **Arcane HUD:** Floating UI anchored in the top-left with the Critz sigil, animated glyphs, and tabbed navigation between weapon classes.
- **Weapon Command Center:** Split view with a real-time 3D viewer on the left and an information codex on the right.
- **Extensible Data Model:** Schema-driven stats that handle unique gear (e.g., quiver capacity vs. magazines) without rewrites.
- **Authoring Friendly:** Designers can add/update equipment, import models, and adjust visuals without touching rendering internals.

## Technology Stack
| Layer | Tooling |
| ----- | ------- |
| Rendering | [Three.js](https://threejs.org/) for WebGL scenes, OrbitControls for navigation |
| UI | Vanilla Web Components / modular ES Modules, CSS custom properties |
| State | Lightweight event bus & centralized weapon state manager |
| Data | JSON-like registries + schema descriptors for validation & UI auto-generation |
| Assets | glTF/GLB preferred for physically-based materials, fallback OBJ/FBX |

## User Interface Blueprint
```
+--------------------------------------------------------------+
| HUD (top-left, absolute)                                     |
|  - Critz wordmark                                            |
|  - Class navigation: Primary | Secondary | Melee | Utility   |
+--------------------------------------------------------------+

+----------------------+---------------------------------------+
| 3D Showcase          | Weapon Codex                          |
| (Three.js canvas)    |  - Class overview                     |
|                      |  - Weapon list (filter/search later)  |
|                      |  - Weapon detail card                 |
|                      |    • Hero stats                       |
|                      |    • Damage profile / fire rate       |
|                      |    • Capacity/quiver/magazine         |
|                      |    • Attachments / special rules      |
+----------------------+---------------------------------------+
```

### Visual Language
- Midnight gradient background with nebula particles.
- Arcane gold + ethereal cyan as accent colors.
- Decorative borders, rune-like separators, serif/fantasy typography.
- Subtle parallax glow around the HUD and detail panels.

## Data Architecture
1. **Schema descriptors** define available stat groups (core stats, firing model, ammo systems, elemental traits). Each descriptor includes label, key, description, data type, units, and default.
2. **Category registry** enumerates Primary/Secondary/Melee/Utility, capturing icon, lore, and data-specific overrides.
3. **Weapon entries** reference category id, attach metadata (model file, preview image, unlock requirements), and populate stats using schema keys. Custom overrides allow category-specific stats (e.g., `quiverCapacity`, `manaReservoir`).
4. **Computed fields** (DPS, reload per mag, etc.) generated in view layer using stat descriptors to avoid storing redundant values.
5. **Localization ready** by storing user-facing strings in a dictionary file referencing keys in weapon data.

## 3D Asset Pipeline
- Standardize on **glTF/GLB** for PBR compatibility.
- Place raw assets in `public/models/<category>/<weapon>.glb`.
- Maintain `src/three/loaders.js` with helpers for caching `GLTFLoader`, `DRACOLoader` for compressed meshes, and Fallback placeholders.
- Each weapon entry references its model path & scale/position offsets.
- Viewer orchestrates loading, attaches lights/background, and exposes animation hooks for idle rotations.

## Application Architecture
- `main.js`: bootstraps layout, state initialization, viewer, and binds event listeners.
- `components/layout.js`: constructs DOM scaffolding (HUD, viewer pane, codex pane) and exposes important node references.
- `components/hud.js`: renders Critz wordmark + tab navigation, listens for state changes to highlight active category.
- `components/weaponBrowser.js`: orchestrates list rendering and dispatches selection events.
- `components/weaponDetail.js`: builds stat tables/cards based on schema descriptors.
- `state/weaponState.js`: central store with getters/setters, emits events on category/weapon changes, handles persistence (future: localStorage).
- `utils/eventBus.js`: micro pub/sub for decoupled modules.
- `data/weaponSchema.js`: stat descriptor definitions (core, firing, ammo, special).
- `data/weaponRegistry.js`: curated list of categories & placeholder weapons.
- `three/viewer.js`: initializes Three.js renderer, lights, resize handling, and placeholder geometry when no model is selected.
- `three/loaders.js`: shared asset loader utilities & caching (stubs initially).

## Planned File Structure
```
Critz-Models/
├── index.html
├── README.md
├── public/
│   └── models/                # future weapon models
└── src/
    ├── main.js
    ├── components/
    │   ├── layout.js
    │   ├── hud.js
    │   ├── weaponBrowser.js
    │   └── weaponDetail.js
    ├── data/
    │   ├── weaponRegistry.js
    │   └── weaponSchema.js
    ├── state/
    │   └── weaponState.js
    ├── styles/
    │   └── main.css
    ├── three/
    │   ├── loaders.js
    │   └── viewer.js
    └── utils/
        └── eventBus.js
```

## Data Contract (Initial)
- **WeaponCategory**
  ```ts
  {
    id: 'primary',
    name: 'Primary',
    description: 'Frontline armaments',
    icon: 'glyph-primary.svg',
    defaultStats: ['damage', 'fireRate', 'magazineSize', 'reloadSpeed'],
    uniqueFields: ['elementalType']
  }
  ```
- **WeaponEntry**
  ```ts
  {
    id: 'ember-rifle',
    category: 'primary',
    name: 'Ember Rifle',
    model: '/models/primary/ember-rifle.glb',
    preview: '/images/weapons/ember-rifle.png',
    stats: {
      damage: { base: 42, scaled: { charged: 110 } },
      fireRate: 3.2,
      magazineSize: 30,
      reloadSpeed: 2.4,
      quiverCapacity: null,
    },
    traits: ['Ignites targets', 'Arcane synergy bonus'],
    metadata: {
      manufacturer: 'Critz Arsenal',
      lore: 'Forged in the sunken furnaces...'
    }
  }
  ```

## Interaction Flow
1. App boot → load schema + registry → hydrate weapon state.
2. HUD navigation emits `category:change` events → state updates → weapon browser re-renders list.
3. Selecting a weapon emits `weapon:change` → detail panel populates stats using schema definitions.
4. Viewer loads associated model via `three/loaders.js`; until load completes, display shimmering placeholder.
5. Future: integrate search, filters, comparison mode, damage curves.

## Development Roadmap
1. **Scaffold (current):** Layout, state skeleton, placeholder data, Three.js scene stub.
2. **Data authoring tools:** Build schema-driven forms, JSON validation.
3. **Model ingestion:** Support GLTF loading, caching, error overlays.
4. **Visual polish:** Animate HUD, add shader-based backgrounds, implement arcane particle layers.
5. **Advanced systems:** Weapon comparison, ability modding, localized text, analytics logging.

## Collaboration Notes
- Keep modules pure & stateless; rely on event bus for cross-communication.
- Favor configuration over conditional logic inside components.
- Document new schema fields in `weaponSchema.js` and README addendum.
- Commit model metadata (scale, rotation, pivot) adjacent to weapon entries for clarity.
- Use TODO comments tagged with `@todo` for future enhancements; log major ideas in README changelog section.

## Next Steps Checklist
- [x] Define architecture & scaffolding (this document).
- [ ] Populate actual weapon data & models.
- [ ] Implement filters/search, DPS calculators, upgrade trees.
- [ ] Integrate audio lore snippets.
- [ ] Optimize for low-end GPUs (LOD, texture compression).

