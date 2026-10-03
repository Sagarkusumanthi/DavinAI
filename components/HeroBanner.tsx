import { ArrowDown } from "lucide-react";

const HERO_IMAGE = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80";

export function HeroBanner({ cityName, onExplore }: { cityName: string; onExplore: () => void }) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative background image, not an optimized content image */}
      <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10" />
      <div className="relative flex min-h-[260px] flex-col justify-end gap-2.5 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Same-day in {cityName}</p>
        <h1 className="max-w-xs font-serif text-3xl font-semibold leading-tight text-white">
          Make someone&rsquo;s day special.
        </h1>
        <p className="text-sm text-white/90">Thoughtful gifts from local stores.</p>
        <button
          type="button"
          onClick={onExplore}
          className="mt-1 flex w-fit items-center gap-2 rounded-full bg-rose px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Explore gifts
          <ArrowDown className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
