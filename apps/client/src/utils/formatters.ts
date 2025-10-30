export function formatLiquidity(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  return `$${value.toFixed(0)}`;
}

export function formatPnL(value: number): string {
  const sign = value >= 0 ? "+" : "-";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function formatPct(value: number): string {
  const sign = value >= 0 ? "+" : "-";
  const abs = Math.abs(value) * 100;
  return `${sign}${abs.toFixed(1)}%`;
}
