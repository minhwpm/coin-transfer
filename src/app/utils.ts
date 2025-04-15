export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`;
}