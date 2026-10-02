import Link from "next/link";
import Image from "next/image";
import { rooms } from "@/lib/catalogue";
import { roomImages } from "@/lib/product-images";
import { ArrowRightIcon } from "../icons";

export function ShopByRoom() {
  return (
    <section id="rooms" className="border-t border-ink">
      <div className="container-page py-14 sm:py-16">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="display text-4xl sm:text-5xl">Shop by room</h2>
          <p className="font-serif text-lg italic text-muted sm:text-xl">Five rooms, one house.</p>
        </div>

        <ul className="mt-5 border-t border-ink sm:mt-6">
          {rooms.map((room, index) => (
            <li key={room.slug} className="border-b border-ink">
              <Link
                href={`/?room=${room.slug}#catalogue`}
                scroll={false}
                className="group grid grid-cols-[2rem_3.5rem_1fr_auto] items-center gap-3 py-3 sm:grid-cols-[4rem_5rem_1fr_1fr_auto] sm:gap-4"
              >
                <span className="font-mono text-[0.625rem]">{String(index + 1).padStart(2, "0")}</span>
                <span className="relative block aspect-square overflow-hidden bg-sand-2">
                  <Image
                    src={roomImages[room.slug].src}
                    alt={roomImages[room.slug].alt}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="display text-2xl sm:text-3xl group-hover:underline">{room.name}</span>
                <span className="hidden text-sm text-muted sm:block">{room.description}</span>
                <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
