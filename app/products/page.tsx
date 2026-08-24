import Footer from "@/components/Footer";
import AllProductsShell from "@/components/AllProductsShell";
import { getProductsPublic } from "@/lib/github";

export const revalidate = 30;

export default async function AllProductsPage() {
  const products = await getProductsPublic();

  return (
    <main>
      <AllProductsShell products={products} />
      <Footer />
    </main>
  );
}
