# Critzapedia Data Library

This folder is the structured home for all Critz encyclopedia data. It is designed so new
entries can be added without touching the UI layer.

## Structure
```
src/data/critzapedia/
├── index.js                     # Aggregated exports for the encyclopedia
├── critters/
│   ├── catalog.js               # Critter entries (current catalog)
│   └── schema.js                # Template + normalization helpers
├── weapons/
│   ├── catalog.js               # Weapon entries (current catalog)
│   └── schema.js                # Weapon schema re-export
└── tools/
    ├── catalog.js               # Tool entries (empty starter list)
    └── schema.js                # Tool template + normalization helpers
```

## Adding new entries
- **Critters**: append to `critters/catalog.js` and follow the `createEmptyCritter()` template.
- **Weapons**: append to `weapons/catalog.js` using the existing data shape.
- **Tools**: append to `tools/catalog.js`, using `createEmptyTool()` as a guide.

If you need new fields, prefer extending the schema files first so the UI can evolve cleanly.
