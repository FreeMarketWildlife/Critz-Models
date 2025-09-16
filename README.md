# Critz Armory Display Application Plan

## Vision
Create an immersive, fantasy-inspired armory interface that catalogs every weapon in Critz. The application should blend an arcane HUD with interactive 3D weapon previews powered by Three.js. It must support rapid iteration on weapon metadata, modular UI sections for Primary, Secondary, Melee, and Utility gear, and an extensible pipeline for importing new 3D assets.

## Technology Stack
- **Core**: Vanilla JavaScript with ES modules
- **3D Rendering**: [Three.js](https://threejs.org/) (module build via CDN during early development)
- **Styling**: CSS with custom properties for theming
- **Bundling**: Start without a bundler; later migrations to Vite/Rollup are straightforward because the codebase is module-based.

## Directory & File Structure
```
Critz-Models/
├── index.html                # Entry HTML document
├── README.md                 # Project plan & onboarding guide
├── styles/
│   └── main.css              # Global styles and theming
├── assets/
│   ├── fonts/                # Decorative HUD fonts
│   ├── textures/             # Shared texture maps
│   └── models/               # GLB/GLTF models (organized by weapon type)
└── src/
    ├── main.js               # Application bootstrap
    ├── app/
    │   └── WeaponDisplayApp.js
    ├── core/
    │   ├── SceneManager.js   # Three.js scene lifecycle
    │   ├── RendererFactory.js
    │   └── ResourceLoader.js # Helper for loading models/textures
    ├── data/
    │   ├── weaponSchema.js   # Schema definition + validation helpers
    │   └── sampleWeapons.js  # Seed data used for UI scaffolding
    ├── hud/
    │   ├── HUDController.js  # Coordinates HUD state with app
    │   └── components/
    │       ├── NavigationTabs.js
    │       ├── WeaponDetailPanel.js
    │       └── WeaponList.js
    └── utils/
        └── eventBus.js
```

> **Note**: Until real assets are available, `.glb` placeholders sit under `assets/models/<category>/placeholder.glb`. The `ResourceLoader` is designed to swap to production CDN/local pipeline later.

## Core Modules
### `WeaponDisplayApp`
- Owns global application state: active weapon category, selected weapon, loaded assets.
- Bootstraps `SceneManager` and `HUDController`.
- Provides hooks for future systems (filters, search, loadouts).

### `SceneManager`
- Sets up camera, lighting, and renderer.
- Manages the weapon preview scene graph and transitions between weapon models.
- Responsible for orbit controls, animation loops, and responsiveness.

### `ResourceLoader`
- Wraps Three.js loaders (GLTFLoader, TextureLoader).
- Maintains caches to avoid reloading identical resources.
- Centralizes fallback handling for missing assets.

### HUD Components
- `NavigationTabs`: Renders Primary/Secondary/Melee/Utility categories with active-state highlighting.
- `WeaponList`: Displays cards/table of weapons in the active category with key stats at a glance.
- `WeaponDetailPanel`: Shows detailed stat blocks, lore snippets, attachments, and context-specific fields (e.g., Quiver capacity instead of magazine size).
- All components receive data via the `HUDController` and emit events through the shared `eventBus`.

## Data Modeling
Weapons are modeled with a base schema plus category-specific extensions.

```js
{
  id: 'string',
  name: 'string',
  category: 'primary' | 'secondary' | 'melee' | 'utility',
  rarity: 'common' | 'rare' | 'epic' | 'legendary',
  description: 'string',
  modelPath: 'assets/models/primary/arcane-rifle.glb',
  previewRotation: { x: Number, y: Number, z: Number },
  stats: {
    damage: Number,
    fireRate: Number,
    reloadSpeed: Number,
    magazineSize: Number,
    capacity: Number,
    projectileType: 'arrow' | 'bolt' | 'bullet' | 'magic',
    drawSpeed: Number,
    chargeTime: Number,
    // ... extendable
  },
  special: {
    elementalAffinity: 'frost',
    passive: 'Fires chained lightning bolts on crits',
    // ... extendable
  }
}
```

The schema is intentionally flexible. The HUD reads the schema metadata to decide which stats to show. Optional fields (like `quiverCapacity`) are displayed only when present.

## UI Layout & Flow
- **Top-left HUD**: Permanent "Crtiz" brand glyph and environment controls (fullscreen, sound toggle).
- **Left rail**: Navigation tabs stacked vertically for category selection.
- **Center stage**: Three.js canvas with weapon preview, orbit controls, and atmospheric VFX.
- **Right panel**: Weapon list (top) and detail panel (bottom) with animated transitions.
- **Bottom bar**: Contextual actions (inspect, equip, compare) – scaffolded for future development.

All sections are responsive; on small screens the nav becomes a top bar and the weapon list collapses into accordions.

## Styling & Theming
- Use CSS custom properties to store arcane color palette (deep purples, gold highlights, smoky neutrals).
- Include parchment-style textures and runic SVG borders.
- Typography: combine a calligraphic display font for headings and a readable serif/sans for body text.
- Animations: subtle glows, shimmering hover states, low-FPS parallax backgrounds.

## 3D Asset Pipeline
1. **Modeling**: Artists export GLB/GLTF with embedded materials.
2. **Optimization**: Run through tools like gltfpack/Draco for size reduction.
3. **Placement**: Save under `assets/models/<category>/` with consistent naming.
4. **Manifest update**: Add metadata entry in `src/data/sampleWeapons.js` (later replaced by API).
5. **Preview tuning**: Adjust `previewRotation`, `cameraOffset`, and environment settings per weapon.

## Development Workflow
- Start with static data from `sampleWeapons.js`.
- Build HUD components with sample data.
- Integrate Three.js scene that swaps models when selection changes.
- Add search/filter controls.
- Connect to persistent backend or CMS when ready.

## Future Enhancements
- Lore codex integration.
- Animated attacks in preview (Three.js animation clips).
- Loadout comparisons & DPS calculators.
- Multiplayer showroom with shared sessions.

## Next Steps Checklist
1. Implement scaffold described below (HUD containers, event wiring, placeholder scene).
2. Populate `sampleWeapons.js` with representative data for each category.
3. Establish theme styles in `styles/main.css`.
4. Create placeholder GLB assets or cubes per category for dev previews.
5. Expand UI interactions (search, filters, comparisons).

