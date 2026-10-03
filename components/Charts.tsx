export const STATUS_COLORS: Record<string, string> = {
  ORDER_PLACED: "#FAC775",
  STORE_ACCEPTED: "#85B7EB",
  PREPARING_GIFT: "#AFA9EC",
  READY_FOR_PICKUP: "#5DCAA5",
  OUT_FOR_DELIVERY: "#D4537E",
  DELIVERED: "#97C459",
  REJECTED: "#F09595",
};

const DAY_MS = 24 * 3600 * 1000;

/** Counts (or sums) items into one bucket per day for the last `days` days, oldest first. */
export function dailyBuckets<T>(items: T[], getDate: (item: T) => string | Date, days = 7, getValue: (item: T) => number = () => 1) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const buckets = new Array(days).fill(0);
  for (const item of items) {
    const t = new Date(getDate(item));
    t.setHours(0, 0, 0, 0);
    const diff = Math.round((startOfToday.getTime() - t.getTime()) / DAY_MS);
    if (diff >= 0 && diff < days) buckets[days - 1 - diff] += getValue(item);
  }
  return buckets;
}

export const HOUR_LABELS = ["12a", "3a", "6a", "9a", "12p", "3p", "6p", "9p"];

/** Counts timestamps into 3-hour buckets of the viewer's local day. */
export function hourlyBuckets(dates: (string | Date)[]) {
  const buckets = new Array(8).fill(0);
  for (const d of dates) buckets[Math.floor(new Date(d).getHours() / 3)]++;
  return buckets;
}

export function Sparkline({ values, color = "#D9663F" }: { values: number[]; color?: string }) {
  const max = Math.max(1, ...values);
  const w = 160;
  const h = 40;
  const step = w / (values.length - 1 || 1);
  const points = values.map((v, i) => `${Math.round(i * step)},${Math.round(h - (v / max) * (h - 4) - 2)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block h-10 w-full" preserveAspectRatio="none" aria-hidden>
      <polyline points={points} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function BarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(1, ...values);
  return (
    <div>
      <div className="mt-3 flex h-[70px] items-end gap-1.5">
        {values.map((v, i) => (
          <div key={i} className="flex flex-1 justify-center" title={`${labels[i]}: ${v}`}>
            <div
              className={i === values.length - 1 ? "w-full max-w-[22px] rounded-t-[5px] rounded-b-[2px] bg-rose" : "w-full max-w-[22px] rounded-t-[5px] rounded-b-[2px] bg-ink"}
              style={{ height: Math.max(4, Math.round((v / max) * 56)) }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1.5">
        {labels.map((l, i) => (
          <span key={i} className="flex-1 text-center text-[9px] text-muted">
            {i % 2 === 0 ? l : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({ segments, size = 120, strokeWidth = 18, children }: { segments: { value: number; color: string }[]; size?: number; strokeWidth?: number; children?: React.ReactNode }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1EFE8" strokeWidth={strokeWidth} />
        {segments
          .filter((s) => s.value > 0)
          .map((seg, i) => {
            const dash = (seg.value / total) * circumference;
            const el = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
            offset += dash;
            return el;
          })}
      </svg>
      {children && <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>}
    </div>
  );
}

export function ProgressBar({ pct, className = "bg-rose" }: { pct: number; className?: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-border">
      <div className={`h-full ${className}`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  );
}
