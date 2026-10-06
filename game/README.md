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
