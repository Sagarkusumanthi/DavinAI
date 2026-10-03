/**
 * Deterministic, clearly-labelled DEMO rating/delivery-time data.
 * This app has no real review or live-delivery system (per spec, demo data
 * only) - these values are derived from the entity id so they stay stable
 * across renders/refreshes, and every place that shows them is labelled
 * "(demo)" so nobody mistakes them for real reviews or live ETAs.
 */
function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function demoRating(id: string): number {
  const h = hashString(id);
  // 4.5 - 4.9, one decimal
  return Math.round((4.5 + (h % 5) / 10) * 10) / 10;
}

export function demoDeliveryWindow(id: string): string {
  const h = hashString(id + "-delivery");
  const start = 30 + (h % 60);
  const end = start + 20 + (h % 20);
  return `${start}-${end} min`;
}
