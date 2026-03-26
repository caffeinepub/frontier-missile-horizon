# Frontier: Missile Horizon

## Current State
The INTEL tab in the bottom nav sheet (`Play.tsx` `SheetContent`) currently shows a simple scrollable list of `CombatEntry` items from `useGameStore().combatLog`. There is no battle visualization. The tab is mostly empty — just timestamp + attacker/defender rows.

`CombatEntry` type (from `gameStore.ts`):
- id, timestamp, attacker, defender, fromPlot, toPlot, success, formationUsed, damageDealt, intercepted, interceptorType

Missile fire is triggered in `Play.tsx` via `handleArsenalFire` → countdown → `handleMissileComplete`. After `resolveBattle` runs, a new `CombatEntry` is prepended to `combatLog`.

## Requested Changes (Diff)

### Add
- `IntelTab` component (new file) replacing the inline intel content in `SheetContent`
- **Global War Feed (idle state)**: Animated radar sweep background, recent combat log entries listed, pulsing activity indicator
- **2D Battle View (active state)**: Canvas/CSS pseudo-3D isometric battle scene
  - Attacker base left, defender base right, angled diorama perspective
  - 4 cinematic phases: LAUNCH (missile lifts off with plume), INTERCEPT CHECK (interceptors arc upward with tense pause), IMPACT or INTERCEPT (explosion or mid-air flash), RESULT (damage tier label flashes: OUTPUT REDUCED / BUILDINGS DISABLED / PLOT DARK / TOTAL DESTRUCTION)
  - Each phase ~0.8-1s, total 3-5 seconds
  - Buildings/icons light up as they activate (silo fires, dome intercepts, bunker absorbs)
  - ATK vs DEF bars animate during resolution
- **Trigger**: Auto-plays when a new combat entry is prepended to `combatLog` (detect via `useEffect` watching `combatLog[0]?.id`)
- **Replay**: Tapping any combat log entry re-triggers the battle view for that entry
- **Mobile layout**: Battle view takes full panel height; collapsible log strip at bottom (tap to expand/collapse)
- **Frosted glass styling**: Match existing panel aesthetic (`rgba(4,12,24,0.97)`, `backdropFilter: blur(16px)`, cyan `#00ffcc` accent)

### Modify
- `Play.tsx` `SheetContent`: Replace inline `intel` tab content with `<IntelTab />`
- INTEL tab sheet height: Use `75vh` (same as map/arsenal) so battle view has room

### Remove
- Inline intel list in `SheetContent`

## Implementation Plan
1. Create `src/frontend/src/components/IntelTab.tsx` with:
   - State: `activeBattle: CombatEntry | null`, `battlePhase: 0-4`, `logExpanded: boolean`
   - Watch `combatLog[0]?.id` change → auto-trigger battle view
   - Idle: radar sweep SVG animation + last 10 log entries
   - Active: CSS/div-based pseudo-3D battle scene with phase transitions using `setTimeout` chain
   - Collapsible log strip at bottom (20-30% height), battle view takes remainder
2. Update `Play.tsx`: import `IntelTab`, use it in `SheetContent` for `intel` tab; add `intel` to tall-sheet list
