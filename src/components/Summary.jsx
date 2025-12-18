import React from "react";
import { tradeServices } from "../services/tradeServices";
import { useAuth } from "../contexts/AuthContext";

// Summary component
// Props: tiles: Array<{ name: string, percentageValue: number }>
// Renders individual summary lines and overall percentage + message
export default function Summary({ tiles = [] }) {
  const total = tiles.reduce((s, t) => s + Number(t?.percentageValue || 0), 0);
  const overall = tiles && tiles.length ? total : 0;

  let message = "Neutral performance";
  // Simple thresholds for message
  if (overall >= 70) message = "Excellent overall — strong positive";
  else if (overall >= 50) message = "Good overall — positive trend";
  else if (overall >= 30) message = "Fair overall — watch closely";
  else message = "Weak overall — needs attention";

  const [saving, setSaving] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const { user } = useAuth();

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      if (!user) throw new Error("You must be signed in to save a trade.");

      if (!tiles || tiles.length === 0) throw new Error("No tiles to save.");
      // determine stop/take flags from the Stop Loss tile (if present)
      const stopTile = (tiles || []).find(
        (x) => String(x.name).trim().toLowerCase() === "stop loss & take profit"
      );
      const stopFlag = !!(
        stopTile?.stopLoss ||
        (stopTile?.properties || []).find((p) =>
          String(p.label).toLowerCase().includes("stop loss")
        )?.checked
      );
      const takeFlag = !!(
        stopTile?.takeProfit ||
        (stopTile?.properties || []).find((p) =>
          String(p.label).toLowerCase().includes("take profit")
        )?.checked
      );

      const payload = {
        user_id: user.id,
        tiles: tiles.map((t) => {
          if (
            String(t.name).trim().toLowerCase() === "stop loss & take profit"
          ) {
            const stop = (t.properties || []).find((p) =>
              String(p.label).toLowerCase().includes("stop loss")
            );
            const take = (t.properties || []).find((p) =>
              String(p.label).toLowerCase().includes("take profit")
            );
            return {
              name: t.name,
              stopLoss: !!stop?.checked,
              takeProfit: !!take?.checked,
            };
          }

          return {
            name: t.name,
            percentageValue:
              t.percentageValue === null || t.percentageValue === undefined
                ? 0
                : Number(t.percentageValue || 0),
          };
        }),
        overall: Number(overall || 0),
        stop_loss: stopFlag,
        take_profit: takeFlag,
        created_at: new Date().toISOString(),
      };

      console.log("Saving trade payload:", payload);
      await tradeServices.saveTradeWithProfileCheck(user.id, payload);
      setStatus({ ok: true, msg: "Trade saved successfully!" });
    } catch (err) {
      console.error("Database Error:", err);
      let userFriendlyMsg = "Something went wrong. Please try again.";
      const code = err?.code || err?.status || null;
      const msg = err?.message || err?.error_description || String(err);
      if (code === "23505") userFriendlyMsg = "This trade already exists.";
      else if (code === "42P01")
        userFriendlyMsg = "Database table not found (trades).";
      else if (msg && msg.toLowerCase().includes("network"))
        userFriendlyMsg = "Network error. Check your internet connection.";
      else if (msg && msg.toLowerCase().includes("signed in"))
        userFriendlyMsg = "You must be signed in to save.";
      else if (msg) userFriendlyMsg = msg;
      setStatus({ ok: false, msg: userFriendlyMsg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="summary-card tile">
      <div className="tile-head">
        <div className="tile-name">Confluence Summary</div>
      </div>

      <div className="tile-body">
        <div className="S-tile-body">
          {tiles.map((t, i) => (
            <div key={i} className="S-property">
              <div className="property-left">
                <div className="property-label">{t.name}</div>
              </div>
              <div className="property-right">
                {String(t.name).trim().toLowerCase() ===
                "stop loss & take profit" ? (
                  <div className="property-value on">
                    <span>Stop Loss</span>
                    <span
                      className={`status-icon ${
                        (t.properties || []).find((p) =>
                          String(p.label).toLowerCase().includes("stop loss")
                        )?.checked
                          ? "on"
                          : "off"
                      }`}
                      aria-hidden
                    >
                      {(t.properties || []).find((p) =>
                        String(p.label).toLowerCase().includes("stop loss")
                      )?.checked
                        ? "✓"
                        : "×"}
                    </span>

                    <span style={{ marginLeft: 8 }}>Take Profit</span>
                    <span
                      className={`status-icon ${
                        (t.properties || []).find((p) =>
                          String(p.label).toLowerCase().includes("take profit")
                        )?.checked
                          ? "on"
                          : "off"
                      }`}
                      aria-hidden
                    >
                      {(t.properties || []).find((p) =>
                        String(p.label).toLowerCase().includes("take profit")
                      )?.checked
                        ? "✓"
                        : "×"}
                    </span>
                  </div>
                ) : (
                  <div className={`property-value on`}>
                    {t.percentageValue}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="summary-overall">
          <div className="overall-percentage">
            Overall: {overall.toFixed(1)}%
          </div>

          <div
            style={{ marginTop: 8, color: "var(--muted)" }}
            className="overall-message"
          >
            {message}
          </div>
        </div>

        <div className="summary-actions" style={{ marginTop: 12 }}>
          <button
            className="btn btn-primary save-btn"
            onClick={handleSave}
            disabled={saving || !tiles || tiles.length === 0}
            title={
              !tiles || tiles.length === 0 ? "No tiles to save" : "Save summary"
            }
          >
            {saving ? "Saving..." : "Save summary"}
          </button>
          {status && (
            <div className={`save-status ${status.ok ? "ok" : "err"}`}>
              {status.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
