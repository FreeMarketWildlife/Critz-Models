# Critz Models Workspace Guide

Use this file as the source of truth for UI behavior, file ownership, and update workflow.

## Purpose

This repo is the Critz encyclopedia and unlock-map workspace.

Main responsibilities:
- design unlock trees
- preview critters, weapons, and tools in 3D
- store structured game content

## Window Model

Use these names exactly:

- Left Window: navigation column with `Critters`, `Weapons & Tools`, `Maps`, `Game Modes`, `Cosmetics`, and `Brainstorming`
- Center Window: one active map or content surface
- Right Window: the 3D viewport and the info panel below it

Current visibility note:

- `Minigames` is hidden from the Left Window for now and should not be displayed until it is intentionally re-enabled later.

## UI State Rules

1. The Left Window is the only top-level navigation state.
2. Only one Left Window option may be visually active at a time.
3. Clicking something in the Left Window must update the Center Window first. Left Window actions should not skip the Center Window and write directly into the Right Window.
4. The active Left Window option must match the content currently shown in the Center Window.
5. The Center Window must show exactly one active surface at a time.
6. The Right Window must reflect the current Center Window selection.
7. If the Center Window has no selected node/item, the Right Window should show guide or placeholder content for the active Center Window surface.
8. A Center Window selection is secondary state. It should update the Right Window, not create a second active Left Window selection.

Default startup state:

- Left Window active option: `Critters > Reptiles`
- Center Window content: reptile unlock map
- Right Window content: reptile guide/placeholder until a critter is selected

## Hard Constraints

Do:

- keep Left Window selection singular
- make Left Window actions replace the Center Window content surface
- keep Center Window limited to one visible surface
- keep Right Window synchronized with the active Center Window surface
- clear stale highlights when switching sections

Do not:

- show multiple Center Window maps at the same time
- let Left Window clicks bypass the Center Window and update the Right Window directly
- leave both critter and weapon categories highlighted at the same time
- let the Right Window show stale info from a previous Center Window surface
- mix content data and layout data

## Layout Source Of Truth

Default layout files:

- `src/data/critterMapDefaultLayout.js`
- `src/data/weaponsMapDefaultLayout.js`
- `src/data/mapsMapDefaultLayout.js`
- `src/data/gamemodesMapDefaultLayout.js`
- `src/data/cosmeticsMapDefaultLayout.js`

These files define default node placement, grouping, and style for Center Window maps.

## Layout Update Workflow

For critters:

1. Edit the map in the app.
2. Use the in-app export/copy action from `src/hud/components/CritterUnlockMap.js`.
3. Paste the exported result into `src/data/critterMapDefaultLayout.js`.

Rules:

- treat the in-app export from `src/hud/components/CritterUnlockMap.js` as authoritative for `src/data/critterMapDefaultLayout.js`
- avoid hand-editing exported critter layout data unless there is a clear reason
- other layout files may be edited directly until they have matching in-app editors

## Weapon Map Structure

Weapon categories:

- `primary`
- `secondary`
- `melee`
- `utility`

Weapon progression groups inside each category:

- `Plant`
- `Primitive`
- `Military`
- `Mystical`
- `Pets`

Weapon maps should follow the same overall interaction model as critter maps:

- selecting a weapon category in the Left Window should replace the Center Window surface
- the active weapon map should occupy the full Center Window
- selecting a weapon node in the Center Window should update the Right Window

Library reading views should follow the same high-level rule:

- selecting a Left Window library entry such as a brainstorming note should open that content in the Center Window
- the Right Window should remain reserved for things selected inside the Center Window, not for the original Left Window click itself

### Alien Nodes

Use the term `alien node` for a ghost/shadow node that appears inside a weapon map but points to content owned by a different map.

Rules:

- alien nodes are still Center Window selections, so they update the Right Window
- alien nodes do not change the active Left Window section
- alien nodes do not switch the Center Window over to the source map
- alien nodes should look visually distinct from normal weapon nodes
- if an alien node points to a critter, clicking it should show that critter's info in the Right Window while the weapon map stays active

Current use case:

- `Wand` in `Secondary Weapons & Tools` uses an alien node for `Salamander Lv. 40`

## Asset Rules

Image root:

- `assets/images/`

Important folders:

- `assets/images/Weapons/Primary`
- `assets/images/Weapons/Secondary`
- `assets/images/Weapons/Melee`
- `assets/images/Weapons/Utility`
- `assets/images/Maps`

When the user says they added new images:

1. check `assets/images/` first
2. find the relevant new files
3. connect them to the matching Center Window content or layout data

Do not require the user to repeat exact filenames if they already said the images were added under `assets/`.

## Key Files

- `src/app/WeaponDisplayApp.js`: top-level app composition and window coordination
- `src/hud/HUDController.js`: Left/Center/Right UI coordination and info panel behavior
- `src/hud/components/CritterUnlockMap.js`: critter map rendering, editing, and export
- `src/hud/components/WeaponUnlockMap.js`: weapon map rendering
- `src/core/SceneManager.js`: Right Window 3D viewport behavior
- `src/data/critterMapDefaultLayout.js`: default critter map layout
- `src/data/weaponsMapDefaultLayout.js`: default weapon map layout
- `src/data/critzapedia/`: structured content data

## Data Boundaries

- `src/data/critzapedia/` = content data
- `src/data/*MapDefaultLayout.js` = layout data

Do not use layout files as encyclopedia content sources.
Do not store layout concerns inside Critzapedia content files unless there is an explicit schema change.

## Current Priorities

1. Keep the critter unlock map stable and easy to edit.
2. Make weapon maps match the critter-map interaction model and presentation style.
3. Keep Left Window, Center Window, and Right Window behavior consistent.
