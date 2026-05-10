"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

type Role = "admin" | "worker";

const NAV = [
  {
    label: "Articles",
    href: "/admin/articles",
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: "Setup",
    href: "/admin/setup",
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <polygon points="12,2 2,7 12,12 22,7" />
        <polyline points="2,17 12,22 22,17" />
        <polyline points="2,12 12,17 22,12" />
      </svg>
    ),
  },
  {
    label: "Légal",
    href: "/admin/legal",
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: "Paramètres",
    href: "/admin/parametres",
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function Sidebar({ role = "admin" }: { role?: Role }) {
  const path = usePathname();
  const { theme, toggle } = useTheme();

  // Workers only see Articles. Defense in depth — server-side guards still
  // enforce this; the sidebar filter is purely cosmetic.
  const visibleNav = role === "worker"
    ? NAV.filter(n => n.href === "/admin/articles")
    : NAV;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <aside
      style={{
        width: 180,
        height: "100vh",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "16px 16px 14px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          C
        </div>
        <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
          CMS
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 9,
            fontWeight: 700,
            background: "var(--accent-bg)",
            color: "var(--accent-light)",
            padding: "2px 5px",
            borderRadius: 4,
            letterSpacing: 0.3,
          }}
        >
          Pro
        </span>
      </div>

      {/* Nav */}
      <nav style={{ padding: "10px 8px", flex: 1 }}>
        {visibleNav.map((item) => {
          const active = path.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 10px",
                borderRadius: 7,
                marginBottom: 2,
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--bg-tertiary)" : "transparent",
                textDecoration: "none",
                transition: "background 0.12s",
              }}
            >
              <span style={{ color: active ? "var(--accent-light)" : "var(--text-muted)" }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "8px 8px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggle}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 10px",
            borderRadius: 7,
            fontSize: 13,
            color: "var(--text-secondary)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          {theme === "dark" ? (
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          {theme === "dark" ? "Mode clair" : "Mode sombre"}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 10px",
            borderRadius: 7,
            fontSize: 13,
            color: "var(--text-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
