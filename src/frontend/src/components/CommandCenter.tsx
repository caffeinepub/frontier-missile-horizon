import { Gem, X, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

const CYAN = "#00ffcc";
const CYAN_DIM = "rgba(0,255,204,0.35)";
const GOLD = "#ffd700";
const BG = "rgba(4,12,24,0.97)";
const BORDER = "rgba(0,255,204,0.22)";
const TEXT = "#e0f4ff";

const MOCK_PLOTS = [
  {
    id: 9144,
    biome: "Desert",
    iron: 42,
    fuel: 18,
    crystal: 7,
    level: 3,
    frntDay: 50.0,
    frntAcc: 363.92,
  },
  {
    id: 9301,
    biome: "Forest",
    iron: 31,
    fuel: 24,
    crystal: 12,
    level: 2,
    frntDay: 50.0,
    frntAcc: 363.92,
  },
  {
    id: 8309,
    biome: "Mountain",
    iron: 55,
    fuel: 9,
    crystal: 4,
    level: 4,
    frntDay: 50.0,
    frntAcc: 363.92,
  },
];

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

interface CommandCenterProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandCenter({ open, onClose }: CommandCenterProps) {
  const player = useGameStore((s) => s.player);
  const plots = useGameStore((s) => s.plots);
  const [searchQuery, setSearchQuery] = useState("");

  const ownedPlotData = player.plotsOwned
    .map((id) => plots.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => ({
      id: p!.id,
      biome: p!.biome as string,
      iron: p!.iron,
      fuel: p!.fuel,
      crystal: p!.crystal,
      level: Math.max(1, Math.floor(p!.richness / 3)),
      frntDay: 50.0,
      frntAcc: 363.92,
    }));

  const displayPlots = ownedPlotData.length > 0 ? ownedPlotData : MOCK_PLOTS;
  const totalAcc = displayPlots.reduce((s, p) => s + p.frntAcc, 0);
  const totalDay = displayPlots.reduce((s, p) => s + p.frntDay, 0);
  const totalIron = displayPlots.reduce((s, p) => s + p.iron, 0);
  const totalFuel = displayPlots.reduce((s, p) => s + p.fuel, 0);
  const totalCrystal = displayPlots.reduce((s, p) => s + p.crystal, 0);
  const filtered = displayPlots.filter(
    (p) => searchQuery === "" || String(p.id).includes(searchQuery),
  );

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
            {displayPlots.length} plots owned ·{" "}
            <span style={{ color: GOLD }}>{totalAcc.toFixed(2)} FRNTR</span>{" "}
            earned lifetime
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
          {/* FRNTR Generation Card */}
          <div
            style={{
              background: "rgba(0,255,204,0.04)",
              border: "1px solid rgba(0,255,204,0.35)",
              borderRadius: 8,
              padding: "12px",
              marginBottom: 8,
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
                  {totalDay.toFixed(1)}
                </div>
                <div
                  style={{
                    fontSize: 7.5,
                    color: CYAN_DIM,
                    marginTop: 3,
                    letterSpacing: 0.5,
                  }}
                >
                  FRNTR / DAY · across {displayPlots.length} plots
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
                  {totalAcc.toFixed(2)}
                </div>
                <div
                  style={{
                    fontSize: 7.5,
                    color: CYAN_DIM,
                    marginTop: 3,
                    letterSpacing: 0.5,
                  }}
                >
                  ACCUMULATED · ready to mint
                </div>
              </div>
            </div>
            <button
              type="button"
              data-ocid="command_center.mint.button"
              style={{
                width: "100%",
                padding: "8px",
                background: "rgba(0,255,204,0.12)",
                border: `1px solid ${CYAN}66`,
                borderRadius: 5,
                color: CYAN,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1.5,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <Zap size={11} />
              MINT FRNTR TOKEN — {totalAcc.toFixed(2)}
            </button>
          </div>

          {/* Collect Minerals */}
          <button
            type="button"
            data-ocid="command_center.collect_minerals.button"
            style={{
              width: "100%",
              padding: "8px",
              background: "transparent",
              border: `1px solid ${BORDER}`,
              borderRadius: 5,
              color: TEXT,
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: 1,
              cursor: "pointer",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            ↓ COLLECT MINERALS — +{totalIron}FE +{totalFuel}FU +{totalCrystal}CR
          </button>

          {/* Total Resources */}
          <div
            style={{
              background: "rgba(0,255,204,0.03)",
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              padding: "10px 12px",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 7.5,
                color: CYAN_DIM,
                letterSpacing: 1.5,
                marginBottom: 8,
                fontWeight: 700,
              }}
            >
              TOTAL RESOURCES EXTRACTED
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 6,
                textAlign: "center",
              }}
            >
              <div>
                <div
                  style={{ fontSize: 18, fontWeight: 700, color: "#94a3b8" }}
                >
                  {totalIron}
                </div>
                <div style={{ fontSize: 7.5, color: CYAN_DIM }}>⚔ IRON</div>
              </div>
              <div>
                <div
                  style={{ fontSize: 18, fontWeight: 700, color: "#f97316" }}
                >
                  {totalFuel}
                </div>
                <div style={{ fontSize: 7.5, color: CYAN_DIM }}>🔧 FUEL</div>
              </div>
              <div>
                <div
                  style={{ fontSize: 18, fontWeight: 700, color: "#3b82f6" }}
                >
                  {totalCrystal}
                </div>
                <div
                  style={{
                    fontSize: 7.5,
                    color: CYAN_DIM,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <Gem size={9} /> CRYSTAL
                </div>
              </div>
            </div>
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
              YOUR TERRITORIES ({displayPlots.length})
            </div>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                      style={{ fontSize: 11, fontWeight: 700, color: CYAN }}
                    >
                      PLOT #{plot.id}
                    </span>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{
                          fontSize: 8,
                          padding: "2px 6px",
                          borderRadius: 3,
                          background: `${BIOME_COLORS[plot.biome] ?? "#666"}22`,
                          border: `1px solid ${BIOME_COLORS[plot.biome] ?? "#666"}55`,
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
                    <span style={{ fontSize: 8, color: "#94a3b8" }}>
                      ⚔ {plot.iron}
                    </span>
                    <span style={{ fontSize: 8, color: "#f97316" }}>
                      🔧 {plot.fuel}
                    </span>
                    <span style={{ fontSize: 8, color: "#3b82f6" }}>
                      💎 {plot.crystal}
                    </span>
                    <span style={{ fontSize: 8, color: GOLD }}>
                      {plot.frntDay} FRNTR/day
                    </span>
                    <span
                      style={{
                        fontSize: 7.5,
                        padding: "1px 5px",
                        borderRadius: 3,
                        background: "rgba(0,255,204,0.1)",
                        border: `1px solid ${BORDER}`,
                        color: CYAN_DIM,
                        letterSpacing: 0.5,
                      }}
                    >
                      LVL {plot.level}
                    </span>
                  </div>
                  <div style={{ fontSize: 9, color: CYAN, marginBottom: 7 }}>
                    {plot.frntAcc} FRNTR accumulated
                  </div>
                  <button
                    type="button"
                    data-ocid={`command_center.mine.button.${i + 1}`}
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
                    ⛏ MINE RESOURCES
                  </button>
                </div>
              ))}
              {filtered.length === 0 && (
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
          </div>
        </div>
      </div>
    </>
  );
}
