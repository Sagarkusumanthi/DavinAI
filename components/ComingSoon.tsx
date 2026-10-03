import { Sparkles, CalendarHeart } from "lucide-react";

const TEASERS = [
  { icon: Sparkles, title: "AI Gift Assistant", body: "Tell us about them - we'll suggest the perfect gift." },
  { icon: CalendarHeart, title: "Birthday Reminders", body: "Never miss a special day again." },
];

export function ComingSoon() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-serif text-lg font-semibold text-ink">Coming soon</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {TEASERS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-3 rounded-2xl border border-dashed border-rose/30 bg-blush/40 p-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-rose shadow-sm">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="flex items-center gap-2 font-semibold text-ink">
                {title}
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose">Soon</span>
              </p>
              <p className="text-sm text-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
