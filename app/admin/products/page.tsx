"use client";

import AdminGate from "@/components/AdminGate";
import ProductManager from "@/components/ProductManager";

export default function AllProductsPage() {
  return (
    <AdminGate>
      <main className="max-w-4xl mx-auto px-6 py-16">
        <a href="/admin" className="text-xs uppercase tracking-widest2 text-stone hover:text-ink transition-colors">
          ← Back to dashboard
        </a>
        <h1 className="font-display italic text-3xl mt-4 mb-8 text-ink">All products</h1>
        <ProductManager pageSize={20} />
      </main>
    </AdminGate>
  );
}
