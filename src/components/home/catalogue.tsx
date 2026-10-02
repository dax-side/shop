import Link from "next/link";
import { rooms, type RoomSlug } from "@/lib/catalogue";
import { getProducts } from "@/lib/products";
import { ProductCard } from "../product-card";

export async function Catalogue({ room }: { room?: RoomSlug }) {
  const items = await getProducts(room);
  const filters = [{ slug: undefined, name: "All" }, ...rooms];

  return (
    <section id="catalogue" className="scroll-mt-4 border-t border-ink">
      <div className="container-page py-14 sm:py-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-[0.625rem]">Showing {items.length} items</p>
            <h2 className="display mt-1 text-4xl sm:text-5xl">The catalogue</h2>
          </div>
          <nav aria-label="Filter by room" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <ul className="flex gap-1.5">
              {filters.map((filter) => {
                const active = filter.slug === room;
                return (
                  <li key={filter.name}>
                    <Link
                      href={filter.slug ? `/?room=${filter.slug}#catalogue` : "/#catalogue"}
                      scroll={false}
                      aria-current={active ? "page" : undefined}
                      className={`block whitespace-nowrap rounded-full border border-ink px-3.5 py-1.5 text-xs ${
                        active ? "bg-ink text-paper" : "hover:bg-ink/5"
                      }`}
                    >
                      {filter.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {items.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 border-t border-l border-ink lg:grid-cols-4">
            {items.map((product) => (
              <div key={product.slug} className="border-r border-b border-ink">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 border-t border-ink pt-6 text-muted">Nothing in this room yet. New stock lands most Fridays.</p>
        )}
      </div>
    </section>
  );
}
