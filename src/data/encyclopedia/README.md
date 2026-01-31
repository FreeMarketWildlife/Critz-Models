# Critzapedia Data Structure

This folder organizes all Critz encyclopedia content into clear sections so new entries can be added consistently.

## Layout
```
encyclopedia/
├── critters/        # Playable critters, animations, and stat blocks
├── gear/
│   ├── weapons/     # Weapon schema + weapon entries
│   └── tools/       # Tool entries (gadgets, utilities, support gear)
└── lore/            # Worldbuilding: factions, locations, materials
```

## Where to Add Content
- **Critters**: `critters/entries.js`
- **Weapons**: `gear/weapons/entries.js`
- **Tools**: `gear/tools/entries.js`
- **Lore**: `lore/*.js`

Templates live in each section's `index.js` to standardize new entries.
