import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

import { Eyebrow, Lede, Reveal } from "@/components/site/primitives";
import { CASES, type CaseStudy } from "@/lib/clinic";

type LoadState = "loading" | "ready" | "missing";

function CaseSlider({ study }: { study: CaseStudy }) {
  const [position, setPosition] = useState(50);
  const [state, setState] = useState<LoadState>("loading");
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(0);

  const beforeSrc = `/images/${study.id}-before.jpg`;
  const afterSrc = `/images/${study.id}-after.jpg`;

  // Both halves must exist, otherwise the comparison is meaningless.
  useEffect(() => {
    let cancelled = false;

    Promise.all(
      [beforeSrc, afterSrc].map(
        (src) =>
          new Promise<boolean>((resolve) => {
            const image = new Image();
            image.onload = () => resolve(true);
            image.onerror = () => resolve(false);
            image.src = src;
          }),
      ),
    ).then((results) => {
      if (!cancelled) setState(results.every(Boolean) ? "ready" : "missing");
    });

    return () => {
      cancelled = true;
    };
  }, [beforeSrc, afterSrc]);

  // The clipped image has to stay the width of the frame, not the clip.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || state !== "ready") return;

    const measure = () => setFrameWidth(frame.clientWidth);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [state]);

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-white">
      <div
        ref={frameRef}
        className="relative aspect-[4/3] select-none overflow-hidden bg-mint [touch-action:pan-y]"
      >
        {state === "loading" && (
          /* This is what ships in the pre-rendered HTML by default -- the
             existence-check below only runs client-side, and a static build
             never runs it at all for crawlers or no-JS visitors. It must
             never reference the image files directly, or a missing pair
             ships as a permanently broken <img> in the page's real markup. */
          <div className="size-full animate-pulse bg-border/40" aria-hidden="true" />
        )}

        {state === "missing" && (
          <div className="grid h-full place-items-center border-[1.5px] border-dashed border-border bg-white p-[26px] text-center">
            <span className="font-mono text-[0.66rem] uppercase leading-[2] tracking-[0.13em] text-muted-foreground">
              <span className="mb-2 block font-sans text-[0.98rem] normal-case tracking-normal text-foreground">
                Photo pair not found
              </span>
              Add <code className="rounded bg-mint px-1.5 py-0.5 text-theatre-deep">{`images/${study.id}-before.jpg`}</code>
              <br />
              and <code className="rounded bg-mint px-1.5 py-0.5 text-theatre-deep">{`images/${study.id}-after.jpg`}</code>
            </span>
          </div>
        )}

        {state === "ready" && (
          <>
            <img
              src={afterSrc}
              alt={`After treatment: ${study.title}`}
              className="absolute inset-0 size-full object-cover"
            />
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${position}%` }}
            >
              <img
                src={beforeSrc}
                alt={`Before treatment: ${study.title}`}
                style={{ width: frameWidth ? `${frameWidth}px` : "100%", maxWidth: "none" }}
                className="absolute inset-y-0 left-0 h-full object-cover"
              />
            </div>

            <span className="pointer-events-none absolute left-3.5 top-3.5 rounded-full bg-ink/70 px-[11px] py-[5px] font-mono text-[0.63rem] uppercase tracking-[0.14em] text-white">
              Before
            </span>
            <span className="pointer-events-none absolute right-3.5 top-3.5 rounded-full bg-ink/70 px-[11px] py-[5px] font-mono text-[0.63rem] uppercase tracking-[0.14em] text-white">
              After
            </span>

            <div
              className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgb(14_33_28/0.25)]"
              style={{ left: `${position}%` }}
            >
              <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-theatre shadow-[0_4px_14px_rgb(14_33_28/0.34)]">
                <ChevronLeft className="size-3.5" strokeWidth={2.4} />
                <ChevronRight className="absolute size-3.5 translate-x-[7px]" strokeWidth={2.4} />
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              aria-label={`Compare before and after: ${study.title}`}
              className="absolute inset-0 size-full cursor-ew-resize appearance-none bg-transparent opacity-0"
            />
          </>
        )}
      </div>

      <div className="px-[22px] py-4">
        <b className="block text-[0.92rem]">{study.title}</b>
        <span className="text-[0.8rem] text-muted-foreground">{study.meta}</span>
      </div>
    </article>
  );
}

export function Results() {
  return (
    <section id="gallery" className="bg-mint py-19 md:py-26">
      <div className="mx-auto max-w-[1180px] px-6">
        <Reveal>
          <Eyebrow>Before &amp; after</Eyebrow>
          <h2 className="text-[clamp(2rem,4vw,3.1rem)]">Real cases, real mouths.</h2>
          <Lede>
            Drag the handle to compare. Every case shown here is published with the patient&rsquo;s
            written consent.
          </Lede>
        </Reveal>

        <div className="mt-11 grid gap-[26px] md:grid-cols-2">
          {CASES.map((study, index) => (
            <Reveal key={study.id} delay={(index % 2) as 0 | 1}>
              <CaseSlider study={study} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={2}>
          <p className="mt-7 flex items-start gap-3 rounded-[14px] bg-white/70 px-5 py-4 text-[0.86rem] text-theatre-deep">
            <ShieldCheck className="mt-0.5 size-[18px] shrink-0 text-theatre" aria-hidden="true" />
            <span>
              <b>Consent notice.</b> Clinical photographs are only published where the patient has
              signed a release covering website use. Ask at reception if you&rsquo;d prefer your
              treatment not be photographed — it changes nothing about your care.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}