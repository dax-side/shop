import { site } from "@/lib/site";

export function HowItWorks() {
  const steps = [
    {
      title: "Delivery",
      body: `Lagos orders arrive in 1–2 days. Elsewhere in Nigeria, ${site.deliveryDays} days. Free over ${site.freeDeliveryThreshold}.`,
    },
    {
      title: "Pickup",
      body: `Order online and collect from the shop at ${site.storeAddress}. Open ${site.openingHours}.`,
    },
    {
      title: "Returns",
      body: `Changed your mind? Send unused items back within ${site.returnWindowDays} days for a full refund.`,
    },
  ];

  return (
    <section id="how-it-works" className="bg-ink text-paper">
      <div className="container-page py-14 sm:py-16">
        <h2 className="display text-4xl sm:text-5xl">How it works</h2>
        <ol className="mt-6 grid gap-8 sm:mt-8 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t border-paper pt-4">
              <span className="font-mono text-[0.625rem]">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-1 text-lg font-medium">{step.title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-snug text-paper/85">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
