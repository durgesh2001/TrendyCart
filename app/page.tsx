import Footer from "@/components/Footer";
import HomeShell from "@/components/HomeShell";
import { getProductsPublic } from "@/lib/github";

export const revalidate = 30;

export default async function HomePage() {
  const products = await getProductsPublic();

  return (
    <main>
      <HomeShell products={products} />
      <Footer />
    </main>
  );
}
