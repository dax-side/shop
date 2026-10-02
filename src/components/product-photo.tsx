type ProductPhotoProps = {
  tone: string;
  caption: string;
  isNew?: boolean;
  className?: string;
  counter?: string;
};

// Stand-in for product photography until real images are added.
export function ProductPhoto({ tone, caption, isNew, className = "", counter }: ProductPhotoProps) {
  return (
    <div
      className={`relative flex flex-col justify-between p-2.5 ${className}`}
      style={{ background: tone }}
      role="img"
      aria-label={caption}
    >
      <div>{isNew && <NewBadge />}</div>
      <div className="flex justify-between gap-2 font-mono text-[0.625rem] text-ink/60">
        <span>PHOTO — {caption}</span>
        {counter && <span>{counter}</span>}
      </div>
    </div>
  );
}

export function NewBadge() {
  return <span className="inline-block bg-accent px-1.5 py-0.5 font-mono text-[0.5625rem] text-paper">NEW</span>;
}
