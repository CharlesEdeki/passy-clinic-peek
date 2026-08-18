import { useEffect } from "react";

import { Eyebrow, Reveal } from "@/components/site/primitives";
import { MAPS_URL, WRITE_REVIEW_URL } from "@/lib/clinic";

/**
 * EmbedSocial's Google Reviews carousel. From the dashboard: Sources >
 * Google Business Profile, layout set to auto-advancing carousel (3 cards
 * desktop / 2 tablet / 1 mobile), styled via their AI editor to match this
 * site's palette. To swap widgets, replace WIDGET_REF with the new one from
 * EmbedSocial's Embed tab -- everything else on this page stays the same.
 */
const WIDGET_REF = "079bbf206e37554d77400ce5678df7c2cdf601ef";

/**
 * EmbedSocial ships a plain <script src="..."> tag, which JSX won't execute
 * the way raw HTML does -- React only runs scripts inserted imperatively
 * into the DOM. This mirrors their own snippet's logic exactly: check
 * document.getElementById(SCRIPT_ID) first, so the script is fetched once
 * regardless of how many times this effect fires (React 18/19 strict mode
 * double-invokes effects in development).
 *
 * Living inside useEffect also means this never runs during the site's
 * static pre-render -- effects are client-only by design -- which matters
 * here specifically, since the widget touches `document` and would throw
 * during a Node-based build otherwise.
 */
const SCRIPT_ID = "EmbedSocialHashtagScript";

function useEmbedSocialScript() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(SCRIPT_ID)) {
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://embedsocial.com/cdn/ht.js";
    document.head.appendChild(script);
  }, []);
}

export function GoogleReviews() {
  useEmbedSocialScript();

  return (
    <section id="reviews" className="border-y border-border bg-background py-19 md:py-26">
      <div className="mx-auto max-w-[1180px] px-6">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>Patient reviews</Eyebrow>
            <h2 className="text-[clamp(2rem,4vw,3.1rem)]">What our patients say on Google.</h2>
            {/* <p className="mt-5 max-w-[56ch] text-[1.05rem] text-muted-foreground">
              Real, verified reviews from people we&rsquo;ve cared for at Jakande Gate, Isolo.
            </p> */}
          </div>
        </Reveal>

        <Reveal delay={1}>
          {/* EmbedSocial finds this div by data-ref once ht.js loads and
              replaces its contents with the carousel. Nothing else should
              be rendered inside it. */}
          <div
            className="embedsocial-hashtag mt-11"
            data-ref={WIDGET_REF}
            data-dynamicload="yes"
            data-lazyload="yes"
          >
            <a
              className="feed-powered-by-es feed-powered-by-es-feed-img es-widget-branding"
              href="https://embedsocial.com/google-reviews-widget/"
              target="_blank"
              rel="noopener noreferrer"
              title="Embed Google reviews"
            >
              <img src="https://embedsocial.com/cdn/icon/embedsocial-logo.webp" alt="EmbedSocial" />
              <div className="es-widget-branding-text">Embed Google reviews</div>
            </a>
          </div>
        </Reveal>

        {/* Google requires a route back to the source, independent of
            whichever widget is currently rendering the reviews themselves. */}
        <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
            Reviews sourced live from Google
          </p>
          <div className="flex flex-wrap gap-3.5">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border-[1.5px] border-border bg-card px-[26px] py-3 text-[0.95rem] font-semibold transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-theatre"
            >
              Read all reviews
            </a>
            <a
              href={WRITE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-theatre px-[26px] py-3 text-[0.95rem] font-semibold text-white shadow-[var(--shadow-cta)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-theatre-deep"
            >
              Write a review
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}