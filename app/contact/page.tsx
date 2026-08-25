"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Image from "next/image";

// Edit hrefs here if you add more socials later.
const SOCIAL_LINKS = [
  {
    name: "Instagram",
    handle: "@duggu.durgesh_",
    href: "https://instagram.com/duggu.durgesh_",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  },
    {
    name: "LinkedIn",
    handle: "@durgesh--pal",
    href: "https://www.linkedin.com/in/durgesh--pal/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.83v1.98h.05c.53-1 1.85-2.06 3.8-2.06 4.07 0 4.82 2.68 4.82 6.16V23h-4v-6.7c0-1.6-.03-3.66-2.23-3.66-2.23 0-2.57 1.74-2.57 3.54V23h-4V8.5z" />
      </svg>
    )
  },
  {
    name: "Gmail",
    handle: "duggudurgeshpal@gmail.com",
    href: "mailto:duggudurgeshpal@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 6.5L12 13L21 6.5" />
      </svg>
    )
  }
] as const;

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: form.subject || "New message from TrendyCart contact form",
          from_name: form.name,
          email: form.email,
          message: form.message
        })
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError("Couldn't send that — please try again.");
      }
    } catch {
      setError("Couldn't send that — please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <header className="sticky top-0 z-50 glass border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="TrendyCart" width={885} height={781} className="h-9 w-auto" priority />
            <span className="font-display italic text-2xl tracking-tight text-ink">TrendyCart</span>
          </a>
          <Link href="/" className="text-xs uppercase tracking-widest2 text-stone hover:text-ink transition-colors">
            ← Back
          </Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-14">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-gold mb-4">Get in touch</p>
          <h1 className="font-display italic text-3xl md:text-4xl text-ink leading-snug mb-8">
            Questions, feedback, or a deal we missed?
          </h1>

          {sent ? (
            <div className="rounded-2xl bg-white/60 border border-black/[0.06] p-6">
              <p className="font-display italic text-xl text-ink mb-1">Message sent.</p>
              <p className="text-sm text-stone">We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
              />
              <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
              <div>
                <label className="text-xs uppercase tracking-widest2 text-stone">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-black/10 bg-white/70 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-gold transition-colors resize-none"
                />
              </div>
              {error ? <p className="text-rust text-xs">{error}</p> : null}
              <button
                type="submit"
                disabled={sending}
                className="bg-ink hover:bg-gold transition-colors duration-300 text-ivory text-xs uppercase tracking-widest2 px-8 py-3.5 rounded-full disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-stone mb-4">Support</p>
          <div className="flex gap-4 mb-8">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2"
              >
                <span className="w-12 h-12 rounded-full glass flex items-center justify-center text-ink group-hover:bg-gold group-hover:text-ivory group-hover:border-gold group-hover:scale-110 transition-all duration-300">
                  {s.icon}
                </span>
                <span className="text-[10px] text-stone group-hover:text-ink transition-colors">{s.handle}</span>
              </a>
            ))}
          </div>

          <p className="text-xs uppercase tracking-widest2 text-stone mb-4">Quick answers</p>
          <ul className="space-y-2 text-sm text-ink/80">
            <li className="underline-grow cursor-pointer inline-block">Are these prices always live?</li>
            <br />
            <li className="underline-grow cursor-pointer inline-block">Do you sell anything directly?</li>
            <br />
            <li className="underline-grow cursor-pointer inline-block">How do I suggest a product?</li>
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest2 text-stone">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-black/10 bg-white/70 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}