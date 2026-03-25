import { X, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  commanderEffectiveAtk,
  commanderEffectiveDef,
  commanderFrntrBonus,
  commanderHasWings,
  getArchetype,
  getCurrentRank,
  getNextRank,
} from "../constants/commanders";
import { getCommander } from "../constants/commanders";
import { BIOME_MINERAL_RATES, MINERAL_USES } from "../constants/minerals";
import { useGameStore } from "../store/gameStore";

const CYAN = "#00ffcc";
const CYAN_DIM = "rgba(0,255,204,0.35)";
const GOLD = "#ffd700";
const BG = "rgba(4,12,24,0.97)";
const BORDER = "rgba(0,255,204,0.22)";
const TEXT = "#e0f4ff";

const BIOME_COLORS: Record<string, string> = {
  Arctic: "#a8d8ea",
  Desert: "#e8c97a",
  Forest: "#4a9b5f",
  Ocean: "#1a6b9e",
  Mountain: "#7a6b5a",
  Volcanic: "#c0392b",
  Grassland: "#5aab4a",
  Toxic: "#7dba3a",
};

const BASE_RATE = 50.0;
const SUB_PARCEL_RATE = 10.0;
const MS_PER_DAY = 86_400_000;

interface CommandCenterProps {
  open: boolean;
  onClose: () => void;
  onOpenCommanderStore?: () => void;
}

// ── Zone 1: Commander NFT Profile Card ─────────────────────────────────────
function CommanderProfileCard({
  onOpenCommanderStore,
}: {
  onOpenCommanderStore?: () => void;
}) {
  const ownedCommanders = useGameStore((s) => s.ownedCommanders);
  const promoteCommander = useGameStore((s) => s.promoteCommander);
  const player = useGameStore((s) => s.player);

  const commander = ownedCommanders[0] ?? null;

  if (!commander) {
    return (
      <div
        data-ocid="command_center.commander.card"
        style={{
          background: "rgba(0,20,40,0.95)",
          border: "1px solid rgba(0,255,204,0.3)",
          borderRadius: 8,
          padding: "18px 14px",
          marginBottom: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.4 }}>👤</div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: CYAN,
            letterSpacing: 2,
          }}
        >
          NO COMMANDER ASSIGNED
        </div>
        <div
          style={{
            fontSize: 8,
            color: CYAN_DIM,
            letterSpacing: 0.5,
            lineHeight: 1.6,
          }}
        >
          Your territories are exposed
        </div>
        <button
          type="button"
          data-ocid="command_center.visit_commander_store.button"
          onClick={() => onOpenCommanderStore?.()}
          style={{
            marginTop: 4,
            padding: "7px 14px",
            background: "rgba(0,255,204,0.1)",
            border: `1px solid ${CYAN}66`,
            borderRadius: 5,
            color: CYAN,
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: 1.5,
            cursor: "pointer",
          }}
        >
          VISIT COMMANDER STORE →
        </button>
      </div>
    );
  }

  const arch = getArchetype(commander.archetypeId);
  const rank = getCurrentRank(commander);
  const nextRank = getNextRank(commander);
  const atk = commanderEffectiveAtk(commander);
  const def = commanderEffectiveDef(commander);
  const frntrBonus = commanderFrntrBonus(commander);
  const hasWings = commanderHasWings(commander);
  const isMaxRank = !nextRank;
  const canAffordPromo =
    !isMaxRank && (nextRank?.promotionCost ?? 0) <= player.frntBalance;

  const portraitSrc =
    "/assets/generated/commander-portrait-default.dim_300x400.jpg";
  const badgeSrc = rank?.image ?? "";

  return (
    <>
      <style>{`
        @keyframes cmdPulse {
          0%, 100% { box-shadow: 0 0 6px rgba(0,255,204,0.3), inset 0 0 6px rgba(0,255,204,0.05); }
          50% { box-shadow: 0 0 16px rgba(0,255,204,0.6), inset 0 0 10px rgba(0,255,204,0.1); }
        }
        .cmd-nft-card { animation: cmdPulse 2.5s ease-in-out infinite; }
      `}</style>
      <div
        data-ocid="command_center.commander.card"
        className="cmd-nft-card"
        style={{
          background: "rgba(0,20,40,0.95)",
          border: "1px solid rgba(0,255,204,0.3)",
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
        }}
      >
        {/* Section label */}
        <div
          style={{
            fontSize: 7.5,
            fontWeight: 700,
            color: CYAN_DIM,
            letterSpacing: 2.5,
            marginBottom: 8,
          }}
        >
          COMMANDER PROFILE
        </div>

        {/* Card body: portrait + info */}
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          {/* Portrait thumbnail */}
          <div
            style={{
              position: "relative",
              width: 72,
              flexShrink: 0,
              borderRadius: 5,
              overflow: "hidden",
              border: "1px solid rgba(0,255,204,0.4)",
            }}
          >
            <img
              src={portraitSrc}
              alt="Commander portrait"
              style={{
                width: "100%",
                height: 90,
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Bottom gradient overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 28,
                background: "linear-gradient(transparent, rgba(0,10,20,0.9))",
              }}
            />
            {/* NFT badge top-right */}
            <div
              style={{
                position: "absolute",
                top: 3,
                right: 3,
                fontSize: 6.5,
                fontWeight: 700,
                color: GOLD,
                background: "rgba(0,0,0,0.7)",
                border: `1px solid ${GOLD}66`,
                borderRadius: 3,
                padding: "1px 4px",
                letterSpacing: 0.5,
                textShadow: `0 0 6px ${GOLD}`,
              }}
            >
              ◈ NFT
            </div>
            {/* Rank badge bottom-left */}
            {badgeSrc && (
              <img
                src={badgeSrc}
                alt="Rank badge"
                style={{
                  position: "absolute",
                  bottom: 3,
                  left: 3,
                  width: 22,
                  height: 22,
                  objectFit: "contain",
                  borderRadius: 2,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>

          {/* Info column */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Archetype */}
            <div
              style={{
                fontSize: 7,
                color: CYAN_DIM,
                letterSpacing: 2,
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              {arch?.name ?? "—"}
            </div>
            {/* Abbreviation */}
            <div
              style={{
                fontSize: 15,
                fontWeight: 900,
                color: CYAN,
                letterSpacing: 1,
                lineHeight: 1,
                textShadow: `0 0 10px ${CYAN}88`,
                marginBottom: 2,
              }}
            >
              {rank?.abbreviation ?? "—"}
            </div>
            {/* Full rank name */}
            <div
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: TEXT,
                letterSpacing: 0.5,
                marginBottom: 6,
              }}
            >
              {rank?.name ?? "Unknown Rank"}
            </div>

            {/* ATK / DEF bars */}
            <div style={{ marginBottom: 5 }}>
              <StatBar label="ATK" value={atk} color="#ef4444" />
              <StatBar label="DEF" value={def} color={CYAN} />
            </div>

            {/* FRNTR bonus */}
            <div
              style={{
                fontSize: 7.5,
                color: GOLD,
                fontWeight: 700,
                letterSpacing: 0.5,
                marginBottom: 4,
              }}
            >
              +{(frntrBonus * 100).toFixed(0)}% GEN BONUS
            </div>

            {/* Special ability chip */}
            {arch?.archetypeBonus && (
              <div
                style={{
                  display: "inline-block",
                  fontSize: 6.5,
                  color: CYAN_DIM,
                  background: "rgba(0,255,204,0.06)",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 3,
                  padding: "2px 5px",
                  letterSpacing: 0.3,
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginBottom: hasWings ? 4 : 0,
                }}
                title={arch.archetypeBonus}
              >
                {arch.archetypeBonus}
              </div>
            )}

            {/* Wings badge */}
            {hasWings && (
              <div
                style={{
                  fontSize: 7,
                  color: CYAN,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textShadow: `0 0 8px ${CYAN}`,
                }}
              >
                ✈ WINGS EARNED
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: `1px dashed ${BORDER}`,
            margin: "8px 0",
          }}
        />

        {/* Actions row */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            data-ocid="command_center.promote.button"
            onClick={() => {
              if (!isMaxRank) promoteCommander(commander.instanceId);
            }}
            disabled={isMaxRank || !canAffordPromo}
            style={{
              flex: 1,
              padding: "6px 8px",
              background:
                !isMaxRank && canAffordPromo
                  ? "rgba(0,255,204,0.12)"
                  : "rgba(0,255,204,0.03)",
              border: `1px solid ${
                !isMaxRank && canAffordPromo ? `${CYAN}88` : BORDER
              }`,
              borderRadius: 5,
              color: !isMaxRank && canAffordPromo ? CYAN : CYAN_DIM,
              fontSize: 7.5,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: !isMaxRank && canAffordPromo ? "pointer" : "default",
              lineHeight: 1.3,
              textAlign: "center",
            }}
          >
            {isMaxRank ? (
              "MAX RANK"
            ) : (
              <>
                PROMOTE
                <br />
                <span style={{ fontSize: 6.5, opacity: 0.75 }}>
                  {nextRank?.name} · {nextRank?.promotionCost} FRNTR
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            data-ocid="command_center.reassign.button"
            onClick={() => onOpenCommanderStore?.()}
            style={{
              flex: 1,
              padding: "6px 8px",
              background: "rgba(255,215,0,0.06)",
              border: `1px solid ${GOLD}44`,
              borderRadius: 5,
              color: GOLD,
              fontSize: 7.5,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: "pointer",
            }}
          >
            REASSIGN
          </button>
        </div>
      </div>
    </>
  );
}

function StatBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pct = Math.min(100, value);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        marginBottom: 3,
      }}
    >
      <span
        style={{
          fontSize: 7,
          color: `${color}cc`,
          fontWeight: 700,
          letterSpacing: 0.5,
          width: 18,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 5,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 3,
            boxShadow: `0 0 5px ${color}88`,
            transition: "width 0.4s ease-out",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 7,
          color: `${color}bb`,
          fontWeight: 700,
          width: 22,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function CommandCenter({
  open,
  onClose,
  onOpenCommanderStore,
}: CommandCenterProps) {
  const player = useGameStore((s) => s.player);
  const plots = useGameStore((s) => s.plots);
  const getSubParcels = useGameStore((s) => s.getSubParcels);
  const claimResources = useGameStore((s) => s.claimResources);
  const claimAllFrntr = useGameStore((s) => s.claimAllFrntr);
  const plotPurchaseTimes = useGameStore((s) => s.plotPurchaseTimes);
  const commanderAssignments = useGameStore((s) => s.commanderAssignments);

  const [searchQuery, setSearchQuery] = useState("");
  const [now, setNow] = useState(Date.now());

  const mineralStartRef = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const ownedPlotData = player.plotsOwned
    .map((id) => plots.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => {
      const subParcels = getSubParcels(p!.id);
      const unlockedEdge = subParcels.filter(
        (sp) => sp.subId > 0 && sp.unlocked === true,
      ).length;
      const assignedCommander = getCommander(commanderAssignments[p!.id] ?? "");
      const rarityBonus = assignedCommander?.rarityBonus ?? 0;
      const dayRate =
        (BASE_RATE + unlockedEdge * SUB_PARCEL_RATE) * (1 + rarityBonus);
      const purchaseTime = plotPurchaseTimes[p!.id] ?? now;
      const accumulated =
        (dayRate / MS_PER_DAY) * Math.max(0, now - purchaseTime);
      return {
        id: p!.id,
        biome: p!.biome as string,
        dayRate,
        accumulated: Number.isNaN(accumulated) ? 0 : accumulated,
        unlockedEdge,
        commanderName: assignedCommander?.name ?? null,
        commanderBonus: rarityBonus,
      };
    });

  const totalDayRate = ownedPlotData.reduce((s, p) => s + p.dayRate, 0);
  const totalAccumulated = ownedPlotData.reduce((s, p) => s + p.accumulated, 0);

  const filtered = ownedPlotData.filter(
    (p) => searchQuery === "" || String(p.id).includes(searchQuery),
  );

  const mineralRatesPerMs = ownedPlotData.reduce(
    (acc, plot) => {
      const biomeRates =
        BIOME_MINERAL_RATES[plot.biome] ?? BIOME_MINERAL_RATES.Grassland;
      return {
        iron: acc.iron + biomeRates.iron / MS_PER_DAY,
        fuel: acc.fuel + biomeRates.fuel / MS_PER_DAY,
        crystal: acc.crystal + biomeRates.crystal / MS_PER_DAY,
        rareEarth: acc.rareEarth + biomeRates.rareEarth / MS_PER_DAY,
      };
    },
    { iron: 0, fuel: 0, crystal: 0, rareEarth: 0 },
  );

  const mineralElapsed = Math.max(0, now - mineralStartRef.current);
  const accruedIron = mineralRatesPerMs.iron * mineralElapsed;
  const accruedFuel = mineralRatesPerMs.fuel * mineralElapsed;
  const accruedCrystal = mineralRatesPerMs.crystal * mineralElapsed;
  const accruedRare = mineralRatesPerMs.rareEarth * mineralElapsed;
  const totalMineralAccrued =
    accruedIron + accruedFuel + accruedCrystal + accruedRare;

  const handleClaim = () => {
    if (totalAccumulated < 0.0001) return;
    claimAllFrntr(totalAccumulated);
  };

  const handleClaimMinerals = () => {
    if (totalMineralAccrued < 0.000001) return;
    for (const plotId of player.plotsOwned) {
      claimResources(plotId);
    }
    mineralStartRef.current = Date.now();
  };

  const handleBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const mineralRows = [
    {
      key: "iron" as const,
      icon: "⚙",
      label: "IRON",
      color: "#9ca3af",
      value: player.iron,
      accrued: accruedIron,
      ratePerSec: mineralRatesPerMs.iron * 1000,
    },
    {
      key: "fuel" as const,
      icon: "⛽",
      label: "FUEL",
      color: "#f97316",
      value: player.fuel,
      accrued: accruedFuel,
      ratePerSec: mineralRatesPerMs.fuel * 1000,
    },
    {
      key: "crystal" as const,
      icon: "💎",
      label: "CRYSTAL",
      color: "#00ffcc",
      value: player.crystal,
      accrued: accruedCrystal,
      ratePerSec: mineralRatesPerMs.crystal * 1000,
    },
    {
      key: "rareEarth" as const,
      icon: "✦",
      label: "RARE EARTH",
      color: "#c084fc",
      value: (player as any).rareEarth ?? 0,
      accrued: accruedRare,
      ratePerSec: mineralRatesPerMs.rareEarth * 1000,
    },
  ];

  return (
    <>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: overlay backdrop */}
      <div
        data-ocid="command_center.backdrop"
        onClick={handleBackdrop}
        style={{
          position: "fixed",
          inset: 0,
          background: open ? "rgba(0,0,0,0.55)" : "transparent",
          zIndex: 58,
          pointerEvents: open ? "auto" : "none",
          transition: "background 0.3s",
        }}
      />
      <div
        data-ocid="command_center.panel"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "min(340px, 92vw)",
          zIndex: 60,
          background: BG,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRight: `1px solid ${CYAN}44`,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 14px 10px",
            borderBottom: `1px solid ${BORDER}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: CYAN,
                letterSpacing: 3,
                textShadow: `0 0 12px ${CYAN}`,
              }}
            >
              COMMAND CENTER
            </span>
            <button
              type="button"
              data-ocid="command_center.close_button"
              onClick={onClose}
              style={{
                background: "rgba(0,255,204,0.08)",
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                cursor: "pointer",
                color: CYAN_DIM,
                padding: "3px 5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={14} />
            </button>
          </div>
          <div style={{ fontSize: 9, color: CYAN_DIM, letterSpacing: 0.5 }}>
            {ownedPlotData.length} plots owned ·{" "}
            <span style={{ color: GOLD }}>
              {Number.isNaN(player.frntBalance)
                ? "0.00"
                : player.frntBalance.toFixed(2)}{" "}
              FRNTR
            </span>{" "}
            balance
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px 12px",
            scrollbarWidth: "thin",
            scrollbarColor: `${BORDER} transparent`,
          }}
        >
          {/* ── ZONE 1: Commander Profile ─────────────────────── */}
          <CommanderProfileCard onOpenCommanderStore={onOpenCommanderStore} />

          {/* ── ZONE 2: FRNTR Generation ──────────────────────── */}
          <div
            style={{
              background: "rgba(0,255,204,0.04)",
              border: "1px solid rgba(0,255,204,0.35)",
              borderRadius: 8,
              padding: "12px",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: CYAN_DIM,
                letterSpacing: 2,
                marginBottom: 10,
                fontWeight: 700,
              }}
            >
              FRNTR TOKEN GENERATION
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: CYAN,
                    lineHeight: 1,
                  }}
                >
                  {Number.isNaN(totalDayRate) ? "0.0" : totalDayRate.toFixed(1)}
                </div>
                <div
                  style={{
                    fontSize: 7.5,
                    color: CYAN_DIM,
                    marginTop: 3,
                    letterSpacing: 0.5,
                  }}
                >
                  FRNTR / DAY · across {ownedPlotData.length} plots
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: GOLD,
                    lineHeight: 1,
                  }}
                >
                  {Number.isNaN(totalAccumulated)
                    ? "0.0000"
                    : totalAccumulated.toFixed(4)}
                </div>
                <div
                  style={{
                    fontSize: 7.5,
                    color: CYAN_DIM,
                    marginTop: 3,
                    letterSpacing: 0.5,
                  }}
                >
                  ACCUMULATED THIS SESSION
                </div>
              </div>
            </div>
            <button
              type="button"
              data-ocid="command_center.claim_all.button"
              onClick={handleClaim}
              disabled={totalAccumulated < 0.0001}
              style={{
                width: "100%",
                padding: "8px",
                background:
                  totalAccumulated >= 0.0001
                    ? "rgba(0,255,204,0.14)"
                    : "rgba(0,255,204,0.04)",
                border: `1px solid ${
                  totalAccumulated >= 0.0001 ? `${CYAN}88` : BORDER
                }`,
                borderRadius: 5,
                color: totalAccumulated >= 0.0001 ? CYAN : CYAN_DIM,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1.5,
                cursor: totalAccumulated >= 0.0001 ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                transition: "all 0.2s",
              }}
            >
              <Zap size={11} />
              CLAIM ALL — +
              {Number.isNaN(totalAccumulated)
                ? "0.0000"
                : totalAccumulated.toFixed(4)}{" "}
              FRNTR
            </button>
          </div>

          {/* Territories */}
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: CYAN,
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              YOUR TERRITORIES ({ownedPlotData.length})
            </div>

            {ownedPlotData.length === 0 ? (
              <div
                data-ocid="command_center.territories.empty_state"
                style={{
                  textAlign: "center",
                  padding: "28px 16px",
                  color: CYAN_DIM,
                  fontSize: 9,
                  letterSpacing: 1,
                  lineHeight: 1.8,
                  border: `1px dashed ${BORDER}`,
                  borderRadius: 6,
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 8, opacity: 0.4 }}>
                  🌐
                </div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>
                  NO TERRITORIES OWNED
                </div>
                <div style={{ fontSize: 8, opacity: 0.7 }}>
                  Tap a plot on the globe to purchase your first territory
                </div>
              </div>
            ) : (
              <>
                <input
                  data-ocid="command_center.search_input"
                  type="text"
                  placeholder="Search by plot ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    background: "rgba(0,0,0,0.5)",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 5,
                    color: TEXT,
                    fontSize: 9,
                    marginBottom: 8,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = CYAN;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = BORDER;
                  }}
                />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {filtered.map((plot, i) => (
                    <div
                      key={plot.id}
                      data-ocid={`command_center.item.${i + 1}`}
                      style={{
                        background: "rgba(0,255,204,0.04)",
                        border: `1px solid ${BORDER}`,
                        borderRadius: 6,
                        padding: "10px 10px 8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: CYAN,
                          }}
                        >
                          PLOT #{plot.id}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 8,
                              padding: "2px 6px",
                              borderRadius: 3,
                              background: `${
                                BIOME_COLORS[plot.biome] ?? "#666"
                              }22`,
                              border: `1px solid ${
                                BIOME_COLORS[plot.biome] ?? "#666"
                              }55`,
                              color: BIOME_COLORS[plot.biome] ?? "#aaa",
                              letterSpacing: 0.5,
                            }}
                          >
                            {plot.biome.toUpperCase()}
                          </span>
                          <div
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              background: "rgba(34,197,94,0.2)",
                              border: "1px solid #22c55e66",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 9,
                            }}
                          >
                            ✓
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                          marginBottom: 5,
                          flexWrap: "wrap",
                        }}
                      >
                        <span style={{ fontSize: 8, color: GOLD }}>
                          {plot.dayRate.toFixed(1)} FRNTR/day
                        </span>
                        {plot.unlockedEdge > 0 && (
                          <span
                            style={{
                              fontSize: 7.5,
                              padding: "1px 5px",
                              borderRadius: 3,
                              background: "rgba(0,255,204,0.08)",
                              border: `1px solid ${BORDER}`,
                              color: CYAN_DIM,
                              letterSpacing: 0.5,
                            }}
                          >
                            +{plot.unlockedEdge} sub-parcels
                          </span>
                        )}
                      </div>

                      {plot.commanderName ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            marginBottom: 5,
                            fontSize: 8,
                            color: "rgba(0,255,204,0.6)",
                            fontFamily: "monospace",
                            letterSpacing: 0.5,
                          }}
                        >
                          <span>⚔</span>
                          <span style={{ color: "#e0f4ff", fontWeight: 700 }}>
                            {plot.commanderName}
                          </span>
                          <span>·</span>
                          <span>
                            +{(plot.commanderBonus * 100).toFixed(0)}% GEN
                          </span>
                        </div>
                      ) : null}

                      <div
                        style={{
                          fontSize: 9,
                          color: CYAN,
                          marginBottom: 7,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {Number.isNaN(plot.accumulated)
                          ? "0.0000"
                          : plot.accumulated.toFixed(4)}{" "}
                        FRNTR accumulated
                      </div>

                      <button
                        type="button"
                        data-ocid={`command_center.mine.button.${i + 1}`}
                        onClick={() => claimResources(plot.id)}
                        style={{
                          width: "100%",
                          padding: "6px",
                          background: "transparent",
                          border: `1px solid ${CYAN}55`,
                          borderRadius: 4,
                          color: CYAN,
                          fontSize: 8.5,
                          fontWeight: 700,
                          letterSpacing: 1,
                          cursor: "pointer",
                        }}
                      >
                        ⛏ COLLECT RESOURCES
                      </button>
                    </div>
                  ))}
                  {filtered.length === 0 && searchQuery !== "" && (
                    <div
                      data-ocid="command_center.territories.empty_state"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: CYAN_DIM,
                        fontSize: 9,
                        letterSpacing: 1,
                      }}
                    >
                      NO PLOTS MATCH YOUR SEARCH
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* MINERALS */}
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: CYAN,
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              MINERALS
            </div>

            {mineralRows.map((m) => (
              <div
                key={m.key}
                style={{
                  background: "rgba(0,255,204,0.03)",
                  border: "1px solid rgba(0,255,204,0.12)",
                  borderRadius: 6,
                  padding: "9px 10px",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: m.color,
                      fontFamily: "monospace",
                      letterSpacing: 1,
                    }}
                  >
                    {m.icon} {m.label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: m.color,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {m.value}
                  </span>
                </div>

                {ownedPlotData.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: m.color,
                          fontVariantNumeric: "tabular-nums",
                          textShadow: `0 0 8px ${m.color}88`,
                          fontFamily: "monospace",
                        }}
                      >
                        +{m.accrued.toFixed(8)}
                      </span>
                      <div
                        style={{
                          fontSize: 7,
                          color: `${m.color}99`,
                          letterSpacing: 1,
                          marginTop: 1,
                          animation: "pulse 1.5s ease-in-out infinite",
                        }}
                      >
                        ACCRUING...
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 7.5,
                        color: "rgba(160,200,220,0.5)",
                        letterSpacing: 0.5,
                        fontVariantNumeric: "tabular-nums",
                        fontFamily: "monospace",
                      }}
                    >
                      +{m.ratePerSec.toFixed(8)}/sec
                    </span>
                  </div>
                )}

                <div
                  style={{
                    height: 4,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 2,
                    overflow: "hidden",
                    marginBottom: 3,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(100, (m.value / 500) * 100)}%`,
                      background: m.color,
                      borderRadius: 2,
                      transition: "width 0.6s ease-out",
                      boxShadow: `0 0 6px ${m.color}66`,
                    }}
                  />
                </div>

                <div
                  style={{
                    fontSize: 7.5,
                    color: "rgba(160,200,220,0.35)",
                    marginTop: 2,
                    letterSpacing: 0.3,
                  }}
                >
                  USED FOR: {MINERAL_USES[m.key]}
                </div>
              </div>
            ))}

            <button
              type="button"
              data-ocid="command_center.claim_minerals.button"
              onClick={handleClaimMinerals}
              disabled={totalMineralAccrued < 0.000001}
              style={{
                width: "100%",
                padding: "8px",
                background:
                  totalMineralAccrued >= 0.000001
                    ? "rgba(0,255,204,0.14)"
                    : "rgba(0,255,204,0.04)",
                border: `1px solid ${
                  totalMineralAccrued >= 0.000001 ? `${CYAN}88` : BORDER
                }`,
                borderRadius: 5,
                color: totalMineralAccrued >= 0.000001 ? CYAN : CYAN_DIM,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1.5,
                cursor: totalMineralAccrued >= 0.000001 ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                marginTop: 4,
                transition: "all 0.2s",
              }}
            >
              <Zap size={11} />
              CLAIM MINERALS — {totalMineralAccrued.toFixed(8)} total
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
