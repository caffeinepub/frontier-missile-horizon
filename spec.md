# Frontier: Missile Horizon

## Current State
- ARSENAL tab has 6 missiles (ICBM-PHANTOM, TOMAHAWK, HELLFIRE, JAVELIN, SENTINEL-400, VIPER-120)
- ArsenalSheet.tsx renders a flat 2-column grid of missile cards + detail view
- missiles.ts defines MissileConfig and MISSILE_CONFIGS
- Backend main.mo has launchMissile() that accepts specific missileType strings
- No artillery or interceptor weapon types exist yet

## Requested Changes (Diff)

### Add
- 4 Artillery weapons: HIMARS-R, PALADIN-H, MLRS-X, EXCALIBUR-P
- 3 Interceptor weapons: IRON-DOME-F, THAAD-X, AEGIS-S
- New weapon interfaces: ArtilleryConfig, InterceptorConfig (extending base WeaponConfig)
- New constants files: artillery.ts, interceptors.ts
- ARSENAL tab sub-tabs: MISSILES | ARTILLERY | INTERCEPTORS
- Artillery: FRNTR consumed on fire, unique VFX (ripple fire, shell arc, area burst)
- Interceptors: passive/auto-defend when assigned to silo, FRNTR consumed per successful intercept
- Interceptor assignment state in gameStore (which plots have interceptors assigned)
- Auto-intercept logic hook (useInterceptor.ts) that checks incoming combat events and auto-fires
- Backend: new weapon type entries in launchMissile switch for all 7 new weapons
- Backend: interceptor assignment and auto-intercept resolution logic

### Modify
- missiles.ts: extract shared WeaponConfig base type; keep MISSILE_CONFIGS as-is
- ArsenalSheet.tsx: add sub-tab navigation (MISSILES | ARTILLERY | INTERCEPTORS); each tab shows its weapon grid; detail view adapts to weapon type
- gameStore.ts: add artilleryInventory, interceptorInventory, assignedInterceptors maps
- main.mo: extend launchMissile switch to include 7 new weapon IDs; add assignInterceptor() and resolveInterceptors() functions

### Remove
- Nothing removed

## Implementation Plan

1. Add artillery.ts constant with ArtilleryConfig type and 4 artillery configs (HIMARS-R, PALADIN-H, MLRS-X, EXCALIBUR-P) — unique VFX, FRNTR costs, trajectories
2. Add interceptors.ts constant with InterceptorConfig type and 3 interceptor configs (IRON-DOME-F, THAAD-X, AEGIS-S) — passive auto stats, intercept %, FRNTR cost per intercept
3. Update gameStore.ts to include artilleryInventory, interceptorInventory, assignedInterceptors
4. Update backend main.mo to handle new weapon IDs and add assignInterceptor() query
5. Update ArsenalSheet.tsx to add sub-tab navigation and render each tab's weapon grid/detail view
6. Add useFireArtillery.ts hook (mirrors useLaunchMissile)
7. Add useInterceptor.ts hook for auto-intercept logic display
