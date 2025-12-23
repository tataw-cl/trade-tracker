import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  return (
    <header>
      <nav>
        {/* mobile hamburger */}
        <button
          className="mobile-hamburger"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((s) => !s)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="nav-left" data-open={mobileOpen}>
          <h1 className="brand">Trade Tracker</h1>
          <ul>
            <li>
              <Link to="/landing" className="nav-link">
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M7 8h6M7 12h6M7 16h6"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Checklist</span>
              </Link>
            </li>
            <li>
              <Link to="/history" className="nav-link">
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 6v6l4 2"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12a9 9 0 11-4.5-7.8"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>History</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="nav-link">
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M3 13h8V3H3v10zM13 21h8v-8h-8v8zM13 3v8h8V3h-8zM3 21h8v-6H3v6z"
                    fill="currentColor"
                  />
                </svg>
                <span>Dashboard</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <div
                className="header-email"
                style={{ marginRight: 8, color: "var(--muted)" }}
                title={user.email}
              >
                <span className="email-text truncate">{user.email}</span>
              </div>
              <button
                className="btn btn-ghost"
                aria-label="Log out"
                onClick={async () => {
                  try {
                    await signOut();
                  } catch (err) {
                    console.error("Sign out failed:", err);
                  }
                }}
              >
                <svg
                  className="icon icon-sm"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M16 17l5-5-5-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 19H6a2 2 0 01-2-2V7a2 2 0 012-2h3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/login" className="btn btn-ghost">
                Sign in
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          )}
        </div>
        {/* mobile menu overlay (links) */}
        <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/landing" onClick={() => setMobileOpen(false)}>
                Checklist
              </Link>
            </li>
            <li>
              <Link to="/history" onClick={() => setMobileOpen(false)}>
                History
              </Link>
            </li>
            <li>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
            </li>
            {user ? (
              <li>
                <button
                  className="btn btn-ghost"
                  onClick={async () => {
                    setMobileOpen(false);
                    try {
                      await signOut();
                    } catch (err) {
                      console.error("Sign out failed:", err);
                    }
                  }}
                >
                  Log out
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/signup" onClick={() => setMobileOpen(false)}>
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
export default Header;
