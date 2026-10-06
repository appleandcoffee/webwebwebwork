# Neon Coast — Coastal Run

A browser-based 3D driving playground using bundled Three.js r170. Open `game/` on GitHub Pages (or `dist/` in the standalone Site).

## Play locally

From the repository root, run `python3 -m http.server 8000`, then visit `http://localhost:8000/game/`. For the standalone Site source, use `python3 -m http.server 8000 --directory dist`.

WASD / arrows drive; Space handbrake; Shift nitro; C cycles cameras; R repairs and resets; P or Escape pauses. Touch driving buttons are available on small screens. Audio starts only when enabled.

## Implementation

- `game.js`: gameplay, AI traffic, chase, camera, effects and interface.
- `visuals.js`: original procedural sports cars and city; physical materials, environment reflections, shadow lighting and batched static geometry.
- `physics.mjs`: fixed 120 Hz planar rigid-body simulation; oriented rectangle collisions, normal and friction impulses, angular momentum, lateral tire grip, braking and steering.
- `three.module.js`: bundled Three.js r170, MIT license in `THREE-LICENSE.txt`.

Crashes transfer momentum, rotate cars, dent bodywork and produce sparks. Heavy body damage emits smoke. Damage is cosmetic and can be repaired with R. This is an arcade prototype: no vertical suspension dynamics, rollovers, soft-body chassis simulation, or photoreal scanned assets. Traffic uses simple lane following and can get stuck after a collision. Desktop with WebGL2 recommended.

## Checks

Run `node game/tests/physics.test.mjs` in the GitHub repository, or `node tests/physics.test.mjs` in the standalone Site checkout. Tests cover steering direction, centered wall rebound, off-center angular impulse, momentum conservation and wall containment.

JavaScript syntax and physics tests were checked. Browser rendering and interactive handling have not been visually playtested in the build environment.

## On-foot update

You now start as Kai Mercer next to the sports car. WASD moves relative to the camera; drag on the world to look around. Shift sprints, Space jumps, and holding C crouches. Pedestrians walk sidewalk loops, pause and glance around, and run when cars or gunfire approach.

F enters the nearest stopped vehicle from its driver's side (within 3 meters of the door). The door opens, Kai reaches and crouches into the seat, and it closes. F exits below 2.5 m/s; if the driver side is blocked, the passenger door is used. Parked vehicles are available nearby. Changing cars preserves the previous vehicle in the world.

1 = unarmed, 2 = pistol, 3 = SMG. Q or the loadout button opens the selection panel. Click fires; hold click for automatic SMG fire. R reloads on foot and repairs/resets while driving. Shots have a tracer and impact sparks; nearby pedestrians react and flee. This update does not implement enemy combat, pedestrian health/death, or a player death system.

Animation includes idle breathing, weight shift, blinking, walking/running, crouching, jumping, articulated door entry/exit, a seated driver, steering wheel movement, recoil, reload gestures, acceleration/braking pitch, body roll and brake lights. Character models and motions are procedural; these are not motion-captured or photoreal human assets.

Additional tests: `node game/tests/character.test.mjs` (from repository root). Covers vehicle eligibility, blocked exits, entry/exit completion, jump landing, weapon ammo and reloading, and rig geometry. Rendering remains unverified by a browser playtest.

Combined gameplay check (renderer mocked, not a visual test): `node --no-warnings --loader ./game/tests/three-test-loader.mjs ./game/tests/integration.test.mjs`. Checks startup, on-foot movement, entering/driving/exiting, firing, reloading, selection and pause.
