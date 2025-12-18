import React from "react";

const Footer = ({
  company = "Your Company",
  links = [
    { label: "Home", href: "/landing" },
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  social = [
    { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
    { label: "GitHub", href: "https://github.com/tataw-cl", icon: "github" },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/tataw-clarkson",
      icon: "linkedin",
    },
  ],
}) => {
  const year = new Date().getFullYear();

  const icon = (name) => {
    const commonProps = {
      width: 20,
      height: 20,
      viewBox: "0 0 24 24",
      fill: "currentColor",
      "aria-hidden": true,
    };
    switch (name) {
      case "twitter":
        return (
          <svg {...commonProps}>
            <path d="M22 5.92c-.65.29-1.34.49-2.07.58.75-.45 1.33-1.17 1.6-2.03-.7.41-1.48.71-2.31.87A3.66 3.66 0 0016.15 4c-2.03 0-3.68 1.66-3.68 3.71 0 .29.03.57.09.83-3.06-.15-5.78-1.66-7.6-3.95a3.7 3.7 0 00-.5 1.87c0 1.29.66 2.43 1.66 3.1-.61-.02-1.18-.19-1.68-.47v.05c0 1.8 1.3 3.3 3.03 3.64-.32.09-.66.13-1.01.13-.25 0-.5-.02-.74-.07.5 1.55 1.95 2.68 3.67 2.71A7.33 7.33 0 012 19.54 10.34 10.34 0 008.75 21c6.6 0 10.21-5.57 10.21-10.4v-.47c.72-.53 1.34-1.2 1.83-1.95-.67.3-1.4.51-2.16.6z" />
          </svg>
        );
      case "github":
        return (
          <svg {...commonProps}>
            <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.26.8-.57v-2.1c-3.3.72-4-1.6-4-1.6-.54-1.38-1.34-1.75-1.34-1.75-1.09-.74.08-.72.08-.72 1.2.09 1.84 1.24 1.84 1.24 1.07 1.85 2.8 1.32 3.48 1.01.11-.78.42-1.32.76-1.62-2.63-.3-5.4-1.32-5.4-5.87 0-1.3.47-2.36 1.24-3.19-.12-.3-.54-1.52.12-3.17 0 0 1.01-.33 3.3 1.22a11.4 11.4 0 016 0c2.28-1.55 3.29-1.22 3.29-1.22.66 1.65.24 2.87.12 3.17.77.83 1.24 1.9 1.24 3.19 0 4.56-2.78 5.56-5.43 5.86.43.37.82 1.1.82 2.22v3.29c0 .31.19.67.81.56A12 12 0 0012 .5z" />
          </svg>
        );
      case "linkedin":
        return (
          <svg {...commonProps}>
            <path d="M20.45 20.45h-3.56v-5.4c0-1.29-.02-2.96-1.8-2.96-1.8 0-2.07 1.4-2.07 2.86v5.5H8.5V9h3.42v1.56h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.34 2.4 4.34 5.52v6.72zM5.34 7.43a2.07 2.07 0 110-4.13 2.07 2.07 0 010 4.13zM6.97 20.45H3.7V9h3.27v11.45z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const styles = {
    footer: {
      borderTop: "1px solid #e6e6e6",
      padding: "24px 16px",
      background: "#fafafa",
    },
    container: {
      maxWidth: 1100,
      margin: "0 auto",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    },
    brand: { display: "flex", flexDirection: "column", gap: 6, color: "#333" },
    nav: { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" },
    link: { color: "#555", textDecoration: "none", fontSize: 14 },
    socialList: {
      display: "flex",
      gap: 10,
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    socialButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 36,
      height: 36,
      borderRadius: 6,
      background: "white",
      border: "1px solid #e6e6e6",
      color: "#333",
      textDecoration: "none",
    },
    small: { fontSize: 13, color: "#777" },
  };

  return (
    <footer style={styles.footer} role="contentinfo">
      <div style={styles.container}>
        <div style={styles.brand}>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>
            {company}
          </div>
          <div style={styles.small}>
            © {year} {company}. All rights reserved.
          </div>
        </div>

        <nav aria-label="Footer navigation" style={styles.nav}>
          <ul
            style={{
              display: "flex",
              gap: 12,
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} style={styles.link}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <ul style={styles.socialList} aria-label="Social links">
            {social.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={styles.socialButton}
                >
                  {icon(s.icon)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
