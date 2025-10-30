/**
 * Common formatting utilities for the dashboard application
 * Centralized formatting functions to avoid code duplication
 */

/**
 * Format a monetary value (volume, liquidity, etc.) with appropriate suffixes
 * @param value - The numeric value to format
 * @param fallback - Fallback value if value is undefined, null, or 0
 * @returns Formatted string with $ prefix and K/M suffixes
 */
export const formatCurrency = (
  value: number | undefined,
  fallback: string = "$0"
): string => {
  if (!value || value === 0) return fallback;

  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

/**
 * Format a price value with 2 decimal places
 * @param price - The price value to format
 * @returns Formatted price string with $ prefix
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

/**
 * Format a percentage change value with appropriate sign
 * @param change - The percentage change value
 * @returns Formatted percentage string with + or - sign
 */
export const formatPercentage = (change: number): string => {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
};

/**
 * Determine trend direction based on a numeric value
 * @param value - The value to analyze
 * @param thresholds - Object with up and down thresholds
 * @returns Trend direction: "up", "down", or "neutral"
 */
export const determineTrend = (
  value: number,
  thresholds: { up: number; down: number } = { up: 0.5, down: -0.5 }
): "up" | "down" | "neutral" => {
  if (value > thresholds.up) return "up";
  if (value < thresholds.down) return "down";
  return "neutral";
};

/**
 * Format volume specifically (alias for formatCurrency with volume-specific fallback)
 * @param volume - The volume value to format
 * @returns Formatted volume string
 */
export const formatVolume = (volume: number | undefined): string => {
  return formatCurrency(volume, "$0");
};

/**
 * Format liquidity specifically (alias for formatCurrency with liquidity-specific fallback)
 * @param liquidity - The liquidity value to format
 * @returns Formatted liquidity string
 */
export const formatLiquidity = (liquidity: number | undefined): string => {
  return formatCurrency(liquidity, "$0");
};

/**
 * Format change percentage specifically (alias for formatPercentage)
 * @param change - The change value to format
 * @returns Formatted change string
 */
export const formatChange = (change: number): string => {
  return formatPercentage(change);
};

/**
 * Format P&L (Profit and Loss) with appropriate sign and currency
 * @param value - The P&L value to format
 * @returns Formatted P&L string with + or - sign
 */
export const formatPnL = (value: number): string => {
  return value >= 0
    ? `+$${value.toFixed(2)}`
    : `-$${Math.abs(value).toFixed(2)}`;
};

/**
 * Format percentage with appropriate sign
 * @param value - The percentage value to format
 * @returns Formatted percentage string with + or - sign
 */
export const formatPct = (value: number): string => {
  return value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
};
