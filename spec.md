# Frontier: Missile Horizon

## Current State
- 7 sub-parcels per plot (1 center Nexus + 6 edges)
- Sub-parcels can have Missile Silos built on them
- Biome auto-derived from H3 lat/lng, drives mineral output
- Base mineral system live with Iron, Fuel, Crystal, Rare Earth
- Storage currently uncapped
- No plot specialization system exists yet

## Requested Changes (Diff)

### Add
- 4 plot specialization types: Trading Depot, Energy & Tech, Armory, Resources
- Player selects specialization when purchasing/claiming a plot (one per plot)
- Each specialization has 1 buildable item on its designated sub-parcel (costs FRNTR)
- Combat buff system per specialization:
  - Trading Depot: +10% FRNTR income from combat wins
  - Energy & Tech: Dome Shield (-10% incoming damage)
  - Armory: +5% hit target accuracy
  - Resources: Storage Vault (+50 storage cap per upgrade, max 500)
- Base resource storage cap: 200 units per resource type
- Multi-plot Network Bonus: owning all 4 specialization types across plots grants passive linked buff
- Visual "linked" indicator on MAP sheet for plots sharing network bonus
- Checks & balances: no single plot can stack all buffs — must own multiple plots

### Modify
- MAP sheet: add specialization selector on plot purchase, show active buffs and storage cap
- Sub-parcel BUILD UI: filter available buildings by plot specialization
- Combat resolution: apply hit accuracy buff from Armory, damage reduction from Dome Shield
- Mineral MINE action: apply storage cap check before crediting resources, apply Resources yield buff
- FRNTR combat win payout: apply Trading Depot bonus if active

### Remove
- Nothing removed

## Implementation Plan
1. Add `specialization` field to `PlotData` in gameStore (Trading Depot | Energy & Tech | Armory | Resources | null)
2. Add `storageCapacity` per resource to player state (default 200, upgradeable to 500)
3. Add `activeBuff` computed from specialization + built structures per plot
4. MAP sheet: specialization picker shown on unspecialized owned plots
5. Sub-parcel BUILD panel: show specialization-specific building option with FRNTR cost
6. Apply buffs in combat resolution (accuracy +5%, damage -10%)
7. Apply storage cap check in MINE action
8. Compute Network Bonus when player owns all 4 specialization types
9. Show linked network indicator on MAP sheet
