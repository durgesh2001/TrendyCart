"use client";

import { useEffect, useState } from "react";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin-auth")
      .then((res) => setAuthed(res.ok))
      .finally(() => setChecking(false));
  }, []);

  async function login() {
    setError("");
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      body: JSON.stringify({ password })
    });
    if (res.ok) setAuthed(true);
    else setError("Wrong password.");
  }

  if (checking) return null;

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ink px-6">
        <div className="w-full max-w-sm glass-dark rounded-2xl p-8">
          <p className="font-display italic text-2xl text-ivory mb-6 text-center">The trendyCart — Admin</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full bg-white/5 border border-ivory/20 rounded-lg text-ivory px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          {error ? <p className="text-red-400 text-xs mt-2">{error}</p> : null}
          <button
            onClick={login}
            className="w-full mt-4 bg-gold hover:bg-goldLight transition-colors text-ivory text-xs uppercase tracking-widest2 py-3 rounded-lg"
          >
            Enter
          </button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
