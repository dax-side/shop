const naira = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 });

export function formatNaira(amount: number) {
  return `₦${naira.format(amount)}`;
}
