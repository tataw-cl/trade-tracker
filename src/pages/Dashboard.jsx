import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { tradeServices } from "../services/tradeServices";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { user } = useAuth();

  const [trades, setTrades] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        if (user) {
          const data = await tradeServices.getTradesByUser(user.id);
          setTrades(data || []);
        } else {
          // if no user, try to get some public trades (or leave empty)
          const data = await tradeServices.getAllTrades();
          setTrades(data || []);
        }
      } catch (err) {
        setError("Failed to load trades for dashboard.");
        setTrades([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  // derive balances & total from trades if available; fallback sample
  const balances =
    trades && trades.length
      ? [
          {
            account: "Portfolio",
            value: trades.reduce((s, t) => s + (Number(t.overall) || 0), 0),
          },
        ]
      : [
          { account: "Broker A", value: 12500.5 },
          { account: "Broker B", value: 8400 },
          { account: "Crypto", value: 3200.75 },
        ];

  const total = balances.reduce((s, b) => s + b.value, 0);

  // Chart data: use the trade `overall` value for each saved trade, ordered by date
  const sortedTrades = (trades || [])
    .slice()
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const chartLabels = sortedTrades.map((t) =>
    new Date(t.created_at).toLocaleDateString()
  );
  const chartDataPoints = sortedTrades.map((t) => Number(t.overall || 0));

  // Compute occurrence percentages for tile names across the user's trades
  const tileCounts = {};
  (trades || []).forEach((t) => {
    (t.tiles || []).forEach((tile) => {
      const name = String(tile.name || "").trim() || "Unknown";
      tileCounts[name] = (tileCounts[name] || 0) + 1;
    });
  });
  const totalTileEntries = Object.values(tileCounts).reduce((s, v) => s + v, 0);
  const tilePercentages = Object.keys(tileCounts).map((name) => ({
    name,
    count: tileCounts[name],
    percent: totalTileEntries
      ? Math.round((tileCounts[name] / totalTileEntries) * 100)
      : 0,
  }));
  // sort descending and take top 6
  tilePercentages.sort((a, b) => b.count - a.count);
  const topTilePercentages = tilePercentages.slice(0, 6);

  // Quick-stats derived from user's trades
  const quickStats = React.useMemo(() => {
    if (!trades || trades.length === 0) return null;

    const totalTrades = trades.length;
    let winCount = 0;
    let sumOverall = 0; // percent values from `overall`
    let profitSum = 0; // sum of wins (prefer `pnl` where available, else `overall`)
    let lossSum = 0; // sum of absolute losses

    trades.forEach((t) => {
      const overall = Number(t.overall || 0);
      const pnl = t.pnl !== undefined && t.pnl !== null ? Number(t.pnl) : NaN;

      // Win determination: prefer pnl when available, else use overall percent
      const isWin = !isNaN(pnl) ? pnl > 0 : overall > 0;
      if (isWin) winCount += 1;

      sumOverall += !isNaN(overall) ? overall : 0;

      // For profit factor, use pnl when present (currency), otherwise use overall percent
      const valueForFactor = !isNaN(pnl) ? pnl : overall;
      if (!isNaN(valueForFactor)) {
        if (valueForFactor > 0) profitSum += valueForFactor;
        else if (valueForFactor < 0) lossSum += Math.abs(valueForFactor);
      }
    });

    const winRate = totalTrades ? Math.round((winCount / totalTrades) * 100) : 0;
    const avgReturn = totalTrades ? sumOverall / totalTrades : 0; // percent
    const profitFactor = lossSum > 0 ? +(profitSum / lossSum).toFixed(2) : profitSum > 0 ? Infinity : 0;

    return { totalTrades, winRate, avgReturn, profitFactor };
  }, [trades]);

  return (
    <div className="page-container dashboard-page">
      <Header />

      <main className="page-main">
        <div className="page-header">
          <h1>Dashboard</h1>
          <div className="page-actions">
            <Link to="/landing" className="btn btn-primary">
              New trade
            </Link>
          </div>
        </div>

        <section className="performance">
          <h2>Performance</h2>
          {/* Top tile occurrence percentages */}
          <div className="tiles-row" style={{ marginBottom: 12 }}>
            {topTilePercentages.length === 0 ? (
              <div className="muted">No trade tiles to summarize yet.</div>
            ) : (
              topTilePercentages.map((t, i) => (
                <div
                  key={i}
                  className="stat-card"
                  style={{ minWidth: 120 }}
                  title={t.name}
                >
                  <div className="stat-value">{t.percent}%</div>
                  <div className="stat-label" style={{ fontSize: 12 }}>
                    <span className="truncate">{t.name}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="chart-area">
            <Line
              data={{
                labels: chartLabels.length ? chartLabels : ["No Data"],
                datasets: [
                  {
                    label: "Overall % per trade",
                    data: chartDataPoints.length ? chartDataPoints : [0],
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59,130,246,0.2)",
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </section>

        {error && <div className="page-error">{error}</div>}

        <section className="quick-stats">
          <h2>Quick stats</h2>
          <div className="stats-grid">
            {quickStats ? (
              <>
                <div className="stat-card">
                  <div className="stat-value">{quickStats.winRate}%</div>
                  <div className="stat-label">Win rate</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{quickStats.avgReturn.toFixed(1)}%</div>
                  <div className="stat-label">Avg return / trade</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">
                    {isFinite(quickStats.profitFactor)
                      ? `${quickStats.profitFactor}x`
                      : quickStats.profitFactor === Infinity
                      ? "∞"
                      : "0x"}
                  </div>
                  <div className="stat-label">Profit factor</div>
                </div>
              </>
            ) : (
              <>
                <div className="stat-card">
                  <div className="stat-value">62%</div>
                  <div className="stat-label">Win rate</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">1.8%</div>
                  <div className="stat-label">Avg return / trade</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">2.5x</div>
                  <div className="stat-label">Profit factor</div>
                </div>
              </>
            )}
          </div>
        </section>

        <div className="footer-spacer" />
      </main>

      <Footer />
    </div>
  );
}
