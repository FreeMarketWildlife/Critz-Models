# Critz Arsenal Display – Engineering Plan

## Vision
Create a fantasy/medieval/arcane-inspired arsenal viewer that showcases every equippable weapon in Critz. Players and designers will be able to browse Primary, Secondary, Melee, and Utility weapons, view detailed statistics, and inspect interactive 3D models rendered with Three.js. The application needs to remain fully data-driven so that new weapons, stat lines, and presentation rules can be added without rewriting core systems.

## Guiding Principles
- **Modularity first.** Keep UI, data, and rendering concerns in discrete modules that communicate through an event bus.
- **Schema-driven data.** A shared schema defines which stats exist and how they are formatted; individual weapons opt-in to whatever stats they use.
- **Extensible assets.** 3D models, textures, audio, and HUD art live in dedicated asset folders that mirror the weapon categories.
- **Lore-friendly presentation.** Typography, colors, and layout reinforce the arcane/fantasy tone.
- **Composable HUD.** The HUD should support future expansion (filters, search, variant info) without structural changes.

## High-Level Architecture
```
Critz-Models/
├── assets/
│   ├── audio/
│   │   └── ui/
│   ├── models/
│   │   ├── melee/
│   │   ├── primary/
│   │   ├── secondary/
│   │   └── utility/
│   └── textures/
│       ├── melee/
│       ├── primary/
│       ├── secondary/
│       └── utility/
├── index.html
├── README.md
└── src/
    ├── app/
    │   └── App.js
    ├── core/
    │   ├── AppState.js
    │   └── EventBus.js
    ├── data/
    │   ├── weaponData.js
    │   └── weaponSchema.js
    ├── systems/
    │   ├── hud/
    │   │   └── HudController.js
    │   └── scene/
    │       └── WeaponScene.js
    ├── styles/
    │   └── main.css
    ├── ui/
    │   └── components/
    │       ├── NavigationMenu.js
    │       ├── WeaponDetails.js
    │       └── WeaponList.js
    └── main.js
```

## Module Responsibilities
### `src/main.js`
Entry point. Bootstraps the `App`, mounts the HUD + Three.js scene, and registers resize listeners.

### `src/app/App.js`
Central coordinator. Initializes shared services, binds event listeners, owns the root DOM structure, and connects the repository to UI + rendering systems.

### `src/core/EventBus.js`
Lightweight pub/sub layer that allows UI components, the renderer, and the data store to communicate without tight coupling. Events include:
- `category:requested`, `category:selected`
- `weapon:requested`, `weapon:selected`
- Future events: `weapon:updated`, `asset:loaded`, etc.

### `src/core/AppState.js`
Tracks active category + weapon, caches category metadata, and exposes helper getters for whichever system needs a snapshot of the current context.

### `src/data/weaponSchema.js`
Defines the schema for weapon stats and metadata. The schema groups stats (e.g., Combat Profile, Handling, Infusions) and describes formatting, units, and tooltips. UI modules render stats dynamically from this schema so new stats can be added in a single place.

### `src/data/weaponData.js`
Holds the seed data for categories and sample weapons. Each weapon entry includes:
- `id`, `name`, `categoryId`, `type`
- `description`, `tags`, `notes`
- `stats` keyed by schema field names (additional stats allowed)
- `model` metadata (`path`, `scale`, `pivot`, `thumbnail`)
- `audiology` metadata placeholders (firing SFX, reload SFX)
This file is temporary until we plug into a back-end or CMS.

### `src/systems/hud/HudController.js`
Owns the heads-up display. Composes `NavigationMenu`, `WeaponList`, and `WeaponDetails` components, listens for app events, and emits interaction events back onto the bus.

### `src/ui/components`
Reusable DOM components with clear APIs. Each component knows how to render itself and exposes setters (`setCategories`, `setActiveWeapon`, etc.). When the UI expands (filters, rarity badges, variant selectors), new components will live alongside these.

### `src/systems/scene/WeaponScene.js`
Wraps Three.js setup and orchestrates model loading. Responsibilities:
- Initialize renderer, camera, resize handling, and lighting with arcane-inspired shaders.
- Load placeholder glyph geometry today; swap in GLB/GLTF models when available.
- React to `weapon:selected` events and load/unload corresponding 3D assets.
- Manage future VFX layers (particle sigils, rune trails, etc.).

### `src/styles/main.css`
Global styles, CSS variables, and component-level styling for the HUD. Includes the fantasy/medieval/arcane aesthetic, transition rules, and layout scaffolding.

## Data Strategy
- **Categories**: Primary, Secondary, Melee, Utility. Each category contains an ordered list of weapons and optional `defaultWeaponId`.
- **Stats Schema**: Each stat descriptor provides a `key`, `label`, `description`, `format`, and optional `icon`. UI reads this to display the correct stat ordering.
- **Weapons**: Arbitrary `stats` object keyed by schema IDs. Fields outside the schema are surfaced under "Additional Insights" so nothing is lost while we iterate on the schema.
- **3D Assets**: Every weapon's `model.path` points to a GLB file inside `assets/models/<category>/`. Supporting textures, icons, and UI overlays sit in `assets/textures/<category>/`. Audio cues live in `assets/audio/`.

## Theming & UX Notes
- Typography: Use Google Fonts `Cinzel` for headers (arcane serif) and `Cormorant Garamond` for body text.
- Color palette: deep violets and midnight blues for the backdrop, gilded highlights (#f7c77d) for interactable elements.
- HUD layering: Transparent vellum cards with subtle glows to float above the Three.js scene.
- Animations: Soft fades + rune-like glows when changing categories/weapons.

## Three.js Integration Plan
1. Initialize a shared renderer + camera when the app boots.
2. Create a rune-like pedestal mesh as a placeholder anchor for weapons.
3. Load category-specific emissive colors while models are pending.
4. On `weapon:selected`, request its GLB, apply transforms from `model` metadata, and attach to the pedestal.
5. Add support for baked animations + particles in later iterations (module stub already exists for hooking into `WeaponScene`).
6. Provide debugging helpers (`WeaponScene.debug`) to inspect bounding boxes and scale.

## Future Workflow
1. **Add/Update Weapon Data**: Edit `src/data/weaponData.js` and append to the corresponding category's `weapons` array. Include all relevant stats—no unused fields are required.
2. **Introduce New Stat**: Update `weaponSchema.js` with the new descriptor. The HUD will automatically surface it for any weapon supplying that stat.
3. **Attach 3D Model**: Drop the `.glb` file into `assets/models/<category>/` and update the weapon's `model.path`. Optional: add preview renders to `assets/textures/<category>/` and reference them in the weapon's `model.thumbnail`.
4. **Customize HUD**: Extend or add UI components in `src/ui/components`. Style updates live in `src/styles/main.css` (or future modular CSS files).
5. **Integrate Editor Tools** (future): Build a simple admin/editor interface to modify `weaponData` in-browser and export JSON.

## Milestones
1. **Foundation (Current)**: Layout skeleton, HUD navigation, sample data, placeholder Three.js scene.
2. **Weapon Content Pass**: Populate each category with real weapons + stats, hook up models.
3. **Interaction Enhancements**: Filters, search, favorite loadouts, lore tabs.
4. **Polish & VFX**: Animated backgrounds, shader-driven runes, context-sensitive HUD embellishments.
5. **Content Pipeline**: Move data into CMS or versioned JSON packs, integrate dynamic loading.

## Developer Notes
- Use semantic HTML where possible; ARIA roles will be added once content is finalized.
- Keep DOM updates scoped—components mutate internal nodes instead of re-rendering whole sections.
- Guard against missing assets (display "Model Pending" states).
- Use ES modules throughout to stay bundler-agnostic until we integrate a build pipeline.

## Quick Start
Open `index.html` in any modern browser. The module-based scripts and CDN-delivered Three.js will initialize automatically.
