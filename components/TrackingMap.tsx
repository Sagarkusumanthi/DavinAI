import { ORDER_SEQUENCE } from "@/lib/services/orderStateMachine";

/** Illustrative (not live) map: rider moves from store to home as the order progresses. */
export function TrackingMap({ status }: { status: string }) {
  const idx = Math.max(0, ORDER_SEQUENCE.indexOf(status as (typeof ORDER_SEQUENCE)[number]));
  const last = ORDER_SEQUENCE.length - 1;
  const progress = idx / last;
  const [sx, sy, hx, hy] = [46, 108, 354, 42];
  const rx = Math.round(sx + (hx - sx) * progress);
  const ry = Math.round(sy + (hy - sy) * progress);
  const showRider = idx >= 1 && idx < last;
  return (
    <svg viewBox="0 0 400 150" className="block h-[150px] w-full" role="img" aria-label="Illustrative delivery map">
      <rect width="400" height="150" fill="#F6E3D7" />
      <path d="M20 20 L380 20 M20 50 L380 50 M20 130 L380 130 M50 10 L50 140 M150 10 L150 140 M250 10 L250 140 M350 10 L350 140" stroke="#E8DED1" strokeWidth="2" />
      <path d={`M${sx} ${sy} Q 200 150 ${hx} ${hy}`} stroke="#D9663F" strokeWidth="3" strokeDasharray="7 6" fill="none" opacity={idx >= 1 ? 1 : 0.35} />
      <g transform={`translate(${sx},${sy})`}>
        <circle r="15" fill="#3B2A22" />
        <text y="5" textAnchor="middle" fontSize="14">🏪</text>
      </g>
      <g transform={`translate(${hx},${hy})`}>
        <circle r="15" fill={idx >= last ? "#1D9E75" : "#8A7A6E"} />
        <text y="5" textAnchor="middle" fontSize="14">🏠</text>
      </g>
      {showRider && (
        <g transform={`translate(${rx},${ry})`}>
          <circle r="14" fill="#D9663F" stroke="#fff" strokeWidth="2" />
          <text y="5" textAnchor="middle" fontSize="13">🛵</text>
        </g>
      )}
    </svg>
  );
}
