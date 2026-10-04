import Link from "next/link";
import { rooms, type RoomSlug } from "@/lib/catalogue";
import { getProducts } from "@/lib/products";
import { ProductCard } from "../product-card";

// The grid shows a page of products at a time; "Show more" links to the same page with a bigger
// `show`, so it works without JavaScript and keeps the place on back/forward.
const PAGE_SIZE = 24;

function catalogueHref(room: RoomSlug | undefined, show?: number) {
  const params = new URLSearchParams();
  if (room) params.set("room", room);
  if (show) params.set("show", String(show));
  const query = params.toString();
  return `/${query ? `?${query}` : ""}#catalogue`;
}

export async function Catalogue({ room, show }: { room?: RoomSlug; show?: number }) {
  const items = await getProducts(room);
  const limit = show && Number.isFinite(show) && show > 0 ? Math.ceil(show / PAGE_SIZE) * PAGE_SIZE : PAGE_SIZE;
  const visible = items.slice(0, limit);
  const filters = [{ slug: undefined, name: "All" }, ...rooms];

  return (
    <section id="catalogue" className="scroll-mt-4 border-t border-ink">
      <div className="container-page py-14 sm:py-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-[0.625rem]">
              Showing {visible.length} of {items.length} items
            </p>
            <h2 className="display mt-1 text-4xl sm:text-5xl">The catalogue</h2>
          </div>
          <nav aria-label="Filter by room" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <ul className="flex gap-1.5">
              {filters.map((filter) => {
                const active = filter.slug === room;
                return (
                  <li key={filter.name}>
                    <Link
                      href={catalogueHref(filter.slug)}
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
            {visible.map((product) => (
              <div key={product.slug} className="border-r border-b border-ink">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : null}
        {visible.length < items.length && (
          <div className="mt-8 flex justify-center">
            <Link
              href={catalogueHref(room, limit + PAGE_SIZE)}
              scroll={false}
              className="rounded-full border border-ink px-6 py-3 text-sm hover:bg-ink hover:text-paper"
            >
              Show more · {Math.min(PAGE_SIZE, items.length - visible.length)} of {items.length - visible.length} left
            </Link>
          </div>
        )}
        {items.length === 0 && (
          <p className="mt-5 border-t border-ink pt-6 text-muted">Nothing in this room yet. Check back soon.</p>
        )}
      </div>
    </section>
  );
}
