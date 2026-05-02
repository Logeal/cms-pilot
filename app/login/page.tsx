"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/sites");
    } else {
      setError("Email ou mot de passe incorrect");
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-primary)",
    }}>
      <div style={{
        width: 380, background: "var(--bg-secondary)",
        border: "1px solid var(--border)", borderRadius: 16, padding: 36,
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 auto 12px",
          }}>C</div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>CMS Admin</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={submit}>
          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Email</span>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required autoFocus
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8,
                background: "var(--bg-tertiary)", border: "1px solid var(--border)",
                color: "var(--text-primary)", fontSize: 13, outline: "none",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Mot de passe</span>
            <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8,
                background: "var(--bg-tertiary)", border: "1px solid var(--border)",
                color: "var(--text-primary)", fontSize: 13, outline: "none",
              }}
            />
          </label>

          {error && <p style={{ color: "var(--danger)", fontSize: 12, marginBottom: 14 }}>{error}</p>}

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "11px", borderRadius: 8,
              background: "var(--accent)", border: "none", color: "#fff",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
