# Critzapedia Data Vault

This directory organizes all encyclopedia-style data for Critz. Each category is
split into focused modules so writers can add entries without touching unrelated
files.

## Structure

```
critzapedia/
├── index.js                # Aggregated exports for the Critzapedia vault
├── critters/
│   ├── critters.js         # Critter entries (models, stats, animations)
│   └── critterSchema.js    # Base shape + normalizers for critter entries
├── weapons/
│   ├── sampleWeapons.js    # Weapon entries + globals
│   └── weaponSchema.js     # Weapon schema helpers
└── tools/
    ├── sampleTools.js      # Tool entries + globals
    └── toolSchema.js       # Tool schema helpers
```

## Adding new entries

1. Pick the correct folder (weapons, tools, critters).
2. Use the schema helper in the same folder to keep fields consistent.
3. Keep data-only changes inside the data files—UI logic stays in `src/app` and
   `src/hud`.

## Naming conventions

- Use lowercase kebab-case IDs (e.g. `arcane-bow`).
- Keep `stats` focused on numeric or short string values.
- Add lore or special rules under `special` to avoid bloating the base schema.
