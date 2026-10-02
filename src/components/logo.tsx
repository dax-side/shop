import Link from "next/link";

export function Logo({ tagline = "Supply Co." }: { tagline?: string }) {
  return (
    <Link href="/" className="flex items-baseline gap-2" aria-label="Oja Supply Co. home">
      <span className="display text-2xl leading-none">Oja</span>
      <span className="label text-[0.625rem]">{tagline}</span>
    </Link>
  );
}
