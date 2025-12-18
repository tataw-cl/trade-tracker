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

  return (
    <div className="page-container dashboard-page">
      <Header />

      <main className="page-main">
        <div className="page-header">
          <h1>Dashboard</h1>
          <div className="page-actions">
            <Link to="/new" className="btn btn-primary">
              New trade
            </Link>
          </div>
        </div>

        <section className="balances">
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
        </section>

        <section className="performance">
          <h2>Performance</h2>
          <div className="chart-area">
            <Line
              data={{
                labels: (() => {
                  if (!trades || trades.length === 0)
                    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
                  // group by day and sort
                  const map = new Map();
                  trades.forEach((t) => {
                    const d = new Date(t.created_at).toLocaleDateString();
                    const existing = map.get(d) || 0;
                    map.set(d, existing + Number(t.overall || 0));
                  });
                  return Array.from(map.keys()).slice(-12);
                })(),
                datasets: [
                  {
                    label: "Overall (sum)",
                    data: (() => {
                      if (!trades || trades.length === 0)
                        return [10000, 10250, 10100, 10500, 11000, 11250];
                      const map = new Map();
                      trades.forEach((t) => {
                        const d = new Date(t.created_at).toLocaleDateString();
                        const existing = map.get(d) || 0;
                        map.set(d, existing + Number(t.overall || 0));
                      });
                      return Array.from(map.values()).slice(-12);
                    })(),
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
                  y: { beginAtZero: false },
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
