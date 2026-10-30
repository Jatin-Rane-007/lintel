/**
 * Formatting helpers shared by every screen.
 *
 * Prices are never shown raw: DESIGN.md §8.7 asks for the currency mark at
 * 0.75× the figure, so the price is split into parts and the renderer decides
 * how to set them.
 */

const CRORE = 10_000_000;
const LAKH = 100_000;

/** Drops a trailing `.0` so "₹1.0Cr" reads "₹1Cr". */
function trimZero(value: number, digits = 2): string {
  return value.toFixed(digits).replace(/\.?0+$/, '');
}

/** Indian market notation: ₹1.25Cr, ₹50L, ₹8,500. */
export function formatPrice(value: number): string {
  const { symbol, amount } = priceParts(value);
  return `${symbol}${amount}`;
}

/** The currency mark and the figure, split for the price tokens in §8.7. */
export function priceParts(value: number): { symbol: string; amount: string } {
  if (!Number.isFinite(value)) return { symbol: '₹', amount: '—' };
  if (value >= CRORE) return { symbol: '₹', amount: `${trimZero(value / CRORE)}Cr` };
  if (value >= LAKH) return { symbol: '₹', amount: `${trimZero(value / LAKH)}L` };
  return { symbol: '₹', amount: value.toLocaleString('en-IN') };
}

/** Area in square feet, with the unit kept out of the figure (§5.4). */
export function formatArea(squareFeet?: number | null): string {
  if (!squareFeet) return '—';
  return squareFeet.toLocaleString('en-IN');
}

/** "Updated 3 h ago" — relative, plain, never vague (§1.4). */
export function formatSince(iso: string | null | undefined): string {
  return relative(iso, 'Updated');
}

/** The same wording for a listing's own age: "Listed 3 h ago". */
export function formatListed(iso: string | null | undefined): string {
  return relative(iso, 'Listed');
}

function relative(iso: string | null | undefined, verb: string): string {
  if (!iso) return '';

  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';

  const minutes = Math.max(0, Math.round((Date.now() - then) / 60_000));
  if (minutes < 1) return `${verb} just now`;
  if (minutes < 60) return `${verb} ${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${verb} ${hours} h ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${verb} ${days} d ago`;

  return `${verb} ${new Date(then).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;
}

/** "6 homes", "1 home" — counts are always spelled with their noun. */
export function countLabel(count: number, singular: string, plural = `${singular}s`): string {
  return `${count.toLocaleString('en-IN')} ${count === 1 ? singular : plural}`;
}
