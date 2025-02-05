/**
 * Utility functions for formatting data
 */

/**
 * Shortens an Ethereum address
 * @param address Full Ethereum address
 * @param chars Number of characters to show on each end
 * @returns Shortened address (e.g., 0x1234...5678)
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Formats a reputation score to a percentage
 * @param score Reputation score (0-1000000)
 * @returns Formatted percentage string
 */
export function formatReputation(score: number): string {
  const percentage = (score / 10000).toFixed(1);
  return `${percentage}%`;
}

/**
 * Formats a timestamp to a readable date
 * @param timestamp Unix timestamp
 * @returns Formatted date string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a timestamp to relative time
 * @param timestamp Unix timestamp
 * @returns Relative time string (e.g., "2 days ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Formats a large number with K, M, B suffixes
 * @param num Number to format
 * @returns Formatted string (e.g., "1.5K")
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

/**
 * Formats gas price in Gwei
 * @param gasPrice Gas price in wei
 * @returns Formatted gas price string
 */
export function formatGasPrice(gasPrice: bigint): string {
  const gwei = Number(gasPrice) / 1e9;
  return `${gwei.toFixed(2)} Gwei`;
}

