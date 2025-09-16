# Critz Armory Display Planner

## Vision
Create an interactive, fantasy-inspired armory application that showcases every equippable weapon in Critz. The experience will combine atmospheric UI with a Three.js-powered 3D showcase so users can browse weapon categories (Primary, Secondary, Melee, Utility), inspect detailed stats, and preview 3D models. The system must be modular so designers can quickly add, update, or retire weapons without touching rendering logic.

## Guiding Principles
- **Separation of concerns:** Keep data, rendering, and UI logic isolated to enable collaborative work across art, design, and engineering.
- **Config-driven content:** Weapon stats, metadata, and relationships live in JSON-like configs so they can be edited without code changes.
- **Composable UI:** HUD and detail panels are componentized for reuse and easy styling tweaks.
- **Scalable asset pipeline:** Directory layout supports 3D models, textures, audio, and VFX assets organized per weapon.
- **Fantasy/arcane aesthetic:** Typography, colors, and UI framing reflect a mystical armory.

## High-Level Architecture
1. **Core Layer (`src/core`)**
   - `App`: Bootstraps the application, loads data, orchestrates UI components and 3D scenes.
   - `EventBus`: Lightweight pub/sub to decouple UI events (category changed, weapon selected) from the scene renderer and data store.
   - `StateManager` (future): Tracks current selection and user preferences (camera angles, sorting) with persistence hooks.

2. **Configuration Layer (`src/config`)**
   - Category definitions, HUD labels, and UI copy lives here. Example: `categories.js`, `uiThemes.js`.
   - Styling tokens (color palettes, glow intensities) enable global theming.

3. **Data Layer (`src/data`)**
   - `weaponSchema.js`: Central definition for stat groups (damage, cadence, magazines/quivers, elemental modifiers, etc.).
   - `weaponRegistry.js`: Loads JSON or API payloads, enforces schema, exposes query helpers (`getWeaponsByCategory`, `getVariants`).
   - Sample data seeds (`sampleWeapons.js`) for development.

4. **3D Layer (`src/scenes` & `src/components`)**
   - `WeaponShowcaseScene`: Builds the Three.js scene (renderer, camera, lights, post-processing placeholders).
   - `WeaponViewer`: Controls canvas lifecycle, attaches to DOM, listens for weapon selection events to load appropriate GLTF/GLB, updates materials and animations.
   - Future support for shader effects, environment maps, and animation timelines.

5. **UI Layer (`src/ui`)**
   - `HUD`: Top-level wrapper assembling category tabs, weapon list, and detail panel.
   - `CategoryTabs`: Displays Primary/Secondary/Melee/Utility, dispatches selection events.
   - `WeaponList`: Shows filtered weapons with search and sorting hooks.
   - `WeaponDetailPanel`: Displays stats, lore, attachment slots; supports dynamic sections (e.g., Quiver vs Magazine).
   - `StatDisplay`: Normalizes varied stat types (bars, icons, text) and handles localization-ready labels.

6. **Utility Layer (`src/utils`)**
   - DOM helpers, stat formatters, math utilities for damage per second, etc.
   - Asset path resolvers to keep references consistent.

7. **Styles (`src/styles`)**
   - `main.css`: Global layout, fonts, arcane gradients, glassmorphism surfaces.
   - Component-specific partials as needed.

8. **Assets (`assets/`)**
   - `models/`: GLB/GLTF + animation clips.
   - `textures/`: 2K/4K PBR maps, icons.
   - `fonts/`: Custom rune-inspired typefaces.
   - Each weapon gets a subfolder named `<weapon-key>/` containing model, textures, metadata.

## Planned File Structure
```
Critz-Models/
├── README.md
├── index.html
├── assets/
│   ├── fonts/
│   ├── models/
│   └── textures/
├── src/
│   ├── core/
│   │   ├── app.js
│   │   └── eventBus.js
│   ├── config/
│   │   └── categories.js
│   ├── data/
│   │   ├── sampleWeapons.js
│   │   ├── weaponRegistry.js
│   │   └── weaponSchema.js
│   ├── scenes/
│   │   └── weaponShowcaseScene.js
│   ├── components/
│   │   └── weaponViewer.js
│   ├── ui/
│   │   ├── hud.js
│   │   ├── categoryTabs.js
│   │   ├── weaponDetailPanel.js
│   │   └── weaponList.js
│   ├── styles/
│   │   └── main.css
│   └── utils/
│       └── dom.js
└── package.json (optional if tooling/bundlers are introduced later)
```

## Data Strategy
- Every weapon entry follows the schema but supports overrides per category. Example fields:
  - `core`: name, slug, category, rarity, lore, manufacturer.
  - `stats`: `damage` (per shot, per burst), `fireRate`, `reloadSpeed`, `magazine`/`quiver` size, `capacity`, `range`, `accuracy`, `element`, `statusChance`, `critChance`.
  - `mechanics`: firing modes, charge times, ammo type, alt-fire.
  - `visual`: model path, texture set, animation rigs, idle pose.
  - `audio`: sfx bundle references.
- Variant-friendly: use `variants` array linking to base weapon with delta stats.
- Support derived stats by providing calculators (e.g., DPS) inside utils.

## UI/UX Notes
- **HUD Frame:** Persistent top-left brand glyph "Crtiz" with shimmering accent. Tabs for Primary/Secondary/Melee/Utility.
- **Main Panel:** Center/Right area hosts 3D viewer; left column for weapon list.
- **Detail Panel:** Slide-out overlay with stat bars, rune icons, upgrade sockets.
- **Accessibility:** High contrast text, keyboard navigation, tooltips for stat definitions.

## Three.js Roadmap
1. Initialize renderer with transparent background to overlay on themed backdrop.
2. Load HDRI/IBL for arcane lighting (tbd). Add volumetric light shafts.
3. Support asynchronous GLTF loading, fallback placeholder mesh.
4. Camera presets per weapon type (longbows vs daggers).
5. Animation timeline controls (idles, inspect animations).

## Asset Pipeline
1. Artists export GLB with standardized scale/origin, embed animation clips.
2. Place assets under `assets/models/<weapon-key>/<weapon-key>.glb`.
3. Provide optional metadata JSON for collider info, pivot offsets.
4. Use `WeaponViewer` loader to apply materials, enable texture overrides.

## Implementation Roadmap
1. **Phase 1** – Framework (this commit): file structure, base HUD, placeholder data, basic Three.js scene scaffolding.
2. **Phase 2** – Data ingestion and schema validation, interactive category switching.
3. **Phase 3** – Real model loading, stat visualizations, UI polish.
4. **Phase 4** – Advanced features: animations, attachments, user customization.

## Collaboration Notes
- Future scripts (Node/CLI) can live under `tools/` for batch importing models or validating stat sheets.
- Automated tests (e.g., Jest) can target data validation and utility functions.
- Consider Storybook/Chromatic for UI component development once content grows.

Refer back to this document before expanding features to ensure additions align with the architecture.
