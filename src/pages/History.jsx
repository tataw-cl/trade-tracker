import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { tradeServices } from "../services/tradeServices";

export default function History() {
  const { user } = useAuth();
  const [trades, setTrades] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetch = async () => {
      if (!user) return setLoading(false);
      setLoading(true);
      try {
        const data = await tradeServices.getTradesByUser(user.id);
        setTrades(data || []);
      } catch (err) {
        console.error("Failed to load trades:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const totalPnL = trades.reduce((sum, t) => sum + (Number(t.pnl) || 0), 0);

  const handleDelete = async (id) => {
    if (!confirm("Delete this trade? This cannot be undone.")) return;
    try {
      await tradeServices.deleteTradeById(id);
      setTrades((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete trade. See console for details.");
    }
  };

  return (
    <div className="page-container history-page">
      <Header />

      <main className="page-main">
        <div className="page-header">
          <h1>Trade History</h1>
          <div className="page-actions">
            <Link to="/new" className="btn btn-primary">
              Record trade
            </Link>
          </div>
        </div>

        <section className="summary">
          <div className="summary-item">
            <div className="summary-value">{trades.length}</div>
            <div className="summary-label">Trades</div>
          </div>

          <div className="summary-item">
            <div className="summary-value">${totalPnL.toFixed(2)}</div>
            <div className="summary-label">Total P&amp;L</div>
          </div>
        </section>

        <section className="trades-list modern-list">
          {loading ? (
            <div>Loading...</div>
          ) : trades.length === 0 ? (
            <div className="empty-state">No saved trades yet.</div>
          ) : (
            <div className="trade-cards">
              {trades.map((t) => (
                <article key={t.id} className="trade-card">
                  <div className="trade-card-head">
                    <div className="trade-date">
                      {new Date(t.created_at).toLocaleString()}
                    </div>
                    <div className="trade-actions">
                      <button
                        className="btn btn-ghost"
                        onClick={() => handleDelete(t.id)}
                        title="Delete trade"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="trade-body">
                    <div className="trade-overall">
                      Overall: {Number(t.overall || 0).toFixed(1)}%
                    </div>
                    <div className="tiles-preview">
                      {(t.tiles || []).slice(0, 6).map((tile, i) => (
                        <span key={i} className="tile-tag">
                          {tile.name === "Stop Loss & Take Profit" ||
                          tile.name === "stop loss & take profit" ? (
                            <>
                              <strong>SL</strong>
                              <span
                                className={`status-icon ${
                                  tile.stopLoss ? "on" : "off"
                                }`}
                              >
                                {tile.stopLoss ? "✓" : "×"}
                              </span>
                              <strong style={{ marginLeft: 6 }}>TP</strong>
                              <span
                                className={`status-icon ${
                                  tile.takeProfit ? "on" : "off"
                                }`}
                              >
                                {tile.takeProfit ? "✓" : "×"}
                              </span>
                            </>
                          ) : (
                            `${tile.name}: ${Number(
                              tile.percentageValue || 0
                            )}%`
                          )}
                        </span>
                      ))}
                      {(t.tiles || []).length > 6 && (
                        <span className="tile-tag">
                          +{(t.tiles || []).length - 6} more
                        </span>
                      )}
                    </div>
                    {t.notes && <div className="trade-notes">{t.notes}</div>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="footer-spacer" />
      </main>

      <Footer />
    </div>
  );
}
