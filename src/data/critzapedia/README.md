# Critzapedia data layout

This folder is the single source of truth for encyclopedia-ready data. Add or edit entries here so the HUD can surface them without digging through unrelated modules.

## Structure
```
src/data/critzapedia/
├── README.md                # You are here
├── index.js                 # Aggregates exports for the Critzapedia
├── critters/
│   ├── critters.js          # Critter entries and animation metadata
│   └── index.js             # Critter exports + empty template helper
├── weapons/
│   ├── sampleWeapons.js     # Weapon entries organized by category
│   └── index.js             # Weapon exports + schema helpers
└── tools/
    └── index.js             # Tool categories + empty template
```

## Adding a new critter
1. Add a new object to `critters/critters.js`.
2. Keep `id` unique and `defaultAnimationId` aligned with the animations array.
3. Use `createEmptyCritter()` in `critters/index.js` as a template.

## Adding a new weapon
1. Add a new object to `weapons/sampleWeapons.js` under the appropriate category comment.
2. Match `category` to the weapon schema (`primary`, `secondary`, `melee`, `utility`).
3. Add any new stat labels to `src/data/weaponSchema.js` if the HUD needs a human-friendly label.

## Adding tools
1. Add entries to the `tools` array in `tools/index.js`.
2. Expand `toolCategories` as needed (keep them lowercase, kebab-less).
3. Use `createEmptyTool()` as a starting template for new entries.
