# Frontier: Missile Horizon

## Current State
- `PlotData` has `iron`, `fuel`, `crystal` fields (all start at 0) and a `richness` value (1–5, deterministic)
- `minerals.ts` has biome tier table and per-tier rates for iron/fuel/crystal only — no rare earth, no efficiency %, no depletion
- `claimResources()` in store adds plot's accumulated resources to player balance, then zeros the plot
- `PlayerData` has `iron`, `fuel`, `crystal` — no rare earth field
- No depletion mechanic, no regen upgrade, no per-plot efficiency or mine count, no biome-derived base rates
- Backend `main.mo` has basic mineral fields but no extraction/depletion logic

## Requested Changes (Diff)

### Add
- `rareEarth: number` to `PlotData` and `PlayerData`
- `efficiency: number` (78–98, randomized per plot seed) to `PlotData`
- `mineCount: number` to `PlotData` — tracks total times this plot has been mined
- `regenActiveUntil: number` to `PlotData` — timestamp when regen boost expires (0 = inactive)
- `BIOME_MINERAL_RATES` map in `minerals.ts`: each biome defines base rates for all 4 resources (iron, fuel, crystal, rareEarth) — biome determines the mix, efficiency % scales output
- `getMineralYield(plot)` helper — returns `{iron, fuel, crystal, rareEarth}` based on biome rates × efficiency × regen boost
- `mineResources(plotId)` store action — calls `getMineralYield`, adds to player balance, decrements efficiency by 0.5 (every 2 mines = -1%), increments mineCount
- `activateRegenBoost(plotId, frntCost)` store action — spends FRNTR, sets `regenActiveUntil = now + 4hrs`, restores +20% efficiency (capped at 98)
- Survey report panel on MAP sheet showing: biome, current efficiency %, projected monthly yield (all 4 resources), mine count, regen boost status/timer
- MINE button on MAP sheet (owned plots only) — triggers `mineResources`, shows yield popup
- REGEN BOOST button on MAP sheet — shows FRNTR cost, activates 4hr boost
- Rare Earth display in LeftSidebarHUD alongside Iron/Fuel/Crystal

### Modify
- `generatePlots()` — add `efficiency: Math.floor(78 + seededRandom(i) * 21)`, `mineCount: 0`, `regenActiveUntil: 0`, `rareEarth: 0`
- `claimResources()` — replace with `mineResources()` that uses biome-aware yield calculation
- `minerals.ts` — add `BIOME_MINERAL_RATES` with all 4 resources per biome, keep existing tier table for backward compat
- `PlayerData` — add `rareEarth: 0`

### Remove
- Old `richness: 1–5` deterministic field (replaced by `efficiency: 78–98` random)
- Old flat `iron/fuel/crystal` accumulation on plot (replaced by computed yield on mine)

## Implementation Plan
1. Update `minerals.ts` — add `BIOME_MINERAL_RATES` for all 12 biomes × 4 resources, add `getMineralYield()` helper
2. Update `gameStore.ts` — extend `PlotData` and `PlayerData` types, update `generatePlots()`, add `mineResources()` and `activateRegenBoost()` actions
3. Update `MapBottomSheet.tsx` — add Survey Report section (efficiency %, projected yields), MINE button, REGEN BOOST button
4. Update `LeftSidebarHUD.tsx` — add Rare Earth row with animated fill bar
5. Keep all changes frontend-only — no new canisters, no backend changes
