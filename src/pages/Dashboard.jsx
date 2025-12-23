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
        console.error("Failed to load trades for dashboard:", err);
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

        {/* <section className="balances">
          <h2>Balances</h2>
          <div className="balances-row">
            {balances.map((b, i) => (
              <div className="balance-card" key={i}>
                <div className="balance-value">
                  $
                  {b.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="balance-label">{b.account}</div>
              </div>
            ))}

            <div className="balance-card total">
              <div className="balance-value">
                $
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="balance-label">Total</div>
            </div>
          </div>
        </section> */}

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

        <section className="quick-stats">
          <h2>Quick stats</h2>
          <div className="stats-grid">
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
          </div>
        </section>

        <div className="footer-spacer" />
      </main>

      <Footer />
    </div>
  );
}
