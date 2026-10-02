import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutHeader } from "@/components/checkout/checkout-header";
import { getProducts } from "@/lib/products";
import { pricing, site } from "@/lib/site";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const products = await getProducts();

  return (
    <>
      <CheckoutHeader />
      <main className="container-page flex-1 pt-6 pb-16 sm:pt-8">
        <h1 className="display mb-6 text-6xl sm:mb-8 sm:text-7xl">Checkout</h1>
        <CheckoutForm
          prices={Object.fromEntries(products.map((product) => [product.slug, product.price]))}
          pricing={pricing}
          deliveryDays={site.deliveryDays}
          paymentProvider={site.paymentProvider}
        />
      </main>
    </>
  );
}
