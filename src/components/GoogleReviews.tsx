import { useEffect, useRef, useState } from "react";

const SCRIPT_SRC = "https://widgets.sociablekit.com/google-reviews/widget.js";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Passy+Dental+Clinic+Crystall+Mall+Jakande+Gate+Isolo+Lagos";

export function GoogleReviews() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.defer = true;
      document.body.appendChild(script);
    }

    const check = window.setInterval(() => {
      if ((containerRef.current?.childElementCount ?? 0) > 0) {
        setLoaded(true);
        window.clearInterval(check);
      }
    }, 400);
    const stop = window.setTimeout(() => window.clearInterval(check), 12000);

    return () => {
      window.clearInterval(check);
      window.clearTimeout(stop);
    };
  }, []);

  return (
    <section id="reviews" className="py-20 md:py-24 bg-background border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 mb-10 md:mb-14 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0 max-w-2xl">
            <p className="font-[JetBrains_Mono,monospace] text-xs text-brand-red uppercase tracking-widest mb-4">
              Patient Reviews
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">
              What our patients say on Google.
            </h2>
            <p className="text-muted-foreground text-pretty">
              Real, verified reviews from people we've cared for at Jakande Gate, Isolo.
            </p>
          </div>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Write a review
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="relative rounded-[28px] md:rounded-[36px] border border-border bg-card p-4 sm:p-6 md:p-8 overflow-hidden">
          <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary to-brand-red" />
          <div
            ref={containerRef}
            className="gr-widget sk-ww-google-reviews"
            data-embed-id="25699874"
          />
          {!loaded && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-background p-6 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-full bg-primary/10 shrink-0" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-3 w-2/3 rounded bg-primary/10" />
                      <div className="h-2.5 w-1/3 rounded bg-brand-red/15" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 w-full rounded bg-muted" />
                    <div className="h-2.5 w-5/6 rounded bg-muted" />
                    <div className="h-2.5 w-3/4 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-5 text-xs text-muted-foreground font-[JetBrains_Mono,monospace] uppercase tracking-widest">
          Reviews sourced live from Google
        </p>
      </div>
    </section>
  );
}