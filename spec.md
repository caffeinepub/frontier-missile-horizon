# Frontier: Missile Horizon

## Current State
- MapBottomSheet has a `QuickLaunchPanel` component (dark, not frosted) that shows available missiles and a large FIRE button when a plot with a silo is selected
- `gameStore.attack()` transfers ownership on success — this is incorrect per latest design
- Battle resolution is a simple ATK vs DEF formula with no formation system
- Plot damage state does not exist — no `plotDamage`, `buildingsDestroyed`, or repair mechanics
- No Tactical Command Panel with land status, defense monitor, or comparison mode

## Requested Changes (Diff)

### Add
- **Plot damage model** on `PlotData`: `structuralDamage: number` (0–100), `buildingsDisabled: boolean`, `isDestroyed: boolean`
- **Formation system**: `BattleFormation` type — SWARM, PRECISION_STRIKE, SUPPRESSION, STEALTH — each modifies hit chance and damage
- **Battle engine function** `resolveBattle(fromId, toId, formation, missileType)` in gameStore:
  - Layer 1: biome base ATK/DEF
  - Layer 2: sub-parcel buildings (Armory=ATK, Defense Tower=DEF, Tech=multiplier, Trading=accuracy debuff)
  - Layer 3: commander rarity ATK/DEF stats
  - Layer 4: interceptors fire in sequence (IRON_DOME=70%, THAAD=85%, AEGIS=90%) before damage resolves
  - Formation modifies final hit %, damage output
  - On success: increase `structuralDamage`, set `buildingsDisabled` at 50%+, `isDestroyed` at 100%
  - Ownership NEVER transfers
- **Repair mechanic** `repairPlot(plotId)` — FRNTR cost (100) restores 25% structural integrity
- **`TacticalCommandPanel` component** — replaces QuickLaunchPanel, frosted glass style (backdrop-filter blur, semi-transparent, NOT dark), slides up when plot is selected:
  - **Header**: TACTICAL COMMAND — PLOT #X, biome badge, coordinates
  - **Land Status section**: efficiency % bar (color-coded), structural damage bar (new), 7 sub-parcel slot indicators (dot grid: filled=built, empty=open, disabled=damaged), specialization badge + buff text, active buffs (regen countdown, NETWORK LINKED)
  - **Defense & Weapons Monitor section**: interceptor cards showing type + status (ACTIVE/OFFLINE), silo count + loaded missile type, incoming threat indicator (red if targeted recently in combat log), ATK score / DEF score summary
  - **Action row**: compact FIRE button (small, red, not dominant), SET DEFENSE button (opens interceptor assign), COMPARE button, REPAIR button (shows if damage > 0)
- **Formation selector** — appears above FIRE button when silo is present: SWARM / PRECISION / SUPPRESSION / STEALTH chips, tap to select before firing
- **Plot Comparison mode** — when COMPARE is tapped in TacticalCommandPanel:
  - Enters compare mode (store flag `compareModeActive`, `comparePlotId`)
  - Globe tap selects the second plot
  - Side-by-side panel (stacked vertically on mobile with VS divider) shows: biome, efficiency, structural damage, sub-parcel build count, defense score, ATK score, owner, commander, specialization, monthly mineral yield for all 4 resources
  - CANCEL COMPARE button exits mode

### Modify
- `gameStore.attack()` → rename/replace with `resolveBattle()`, remove ownership transfer logic entirely
- `MapBottomSheet` → remove `QuickLaunchPanel`, add `TacticalCommandPanel` in its place
- `PlotData` interface → add `structuralDamage`, `buildingsDisabled`, `isDestroyed` fields (default 0 / false)
- `generatePlots()` → initialize new fields to defaults
- Combat log entries → include `formationUsed`, `damageDealt`, `intercepted` fields

### Remove
- Old `QuickLaunchPanel` component (fully replaced by TacticalCommandPanel)
- Ownership transfer logic in attack/combat resolution

## Implementation Plan
1. Update `PlotData` interface and `generatePlots()` in gameStore to add damage fields
2. Add `BattleFormation` type and `resolveBattle()` to gameStore — full layered ATK/DEF calc, interceptor sequence, formation modifiers, damage application (no ownership transfer)
3. Add `repairPlot()` action to gameStore
4. Add `compareModeActive` / `comparePlotId` to store state
5. Build `TacticalCommandPanel` component — frosted glass, land status section, defense monitor section, action row with formation chips
6. Build `PlotComparisonView` component — side-by-side VS panel
7. Replace `QuickLaunchPanel` in `MapBottomSheet` with `TacticalCommandPanel`
8. Wire FIRE button to `resolveBattle()` with selected formation
9. Wire REPAIR button to `repairPlot()`
10. Wire COMPARE to store compare mode, second globe tap sets `comparePlotId`
