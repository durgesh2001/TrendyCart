"use client";

import { useState } from "react";
import Link from "next/link";     
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // No backend wired up — this is a mock form. Point this at a real
    // endpoint (e.g. an email API or a form service) when you're ready.
    setSent(true);
  }

  return (
    <main>
      <header className="sticky top-0 z-50 glass border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <Link href="/" className="font-display italic text-2xl tracking-tight text-ink">
            The&nbsp;TrendyCart
          </Link>
          <Link href="/" className="text-xs uppercase tracking-widest2 text-stone hover:text-ink transition-colors">
            ← Back to the TrendyCart
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
              <button
                type="submit"
                className="bg-ink hover:bg-gold transition-colors duration-300 text-ivory text-xs uppercase tracking-widest2 px-8 py-3.5 rounded-full"
              >
                Send message
              </button>
            </form>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-stone mb-4">Support</p>
          <div className="space-y-2 text-sm text-ink mb-8">
            <p>hello@trendycart.example</p>
            <p>@trendycart on Instagram</p>
            <p>@trendycart on X</p>
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
