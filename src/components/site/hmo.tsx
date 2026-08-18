import { useState } from "react";

import { Reveal } from "@/components/site/primitives";
import { HMO_PARTNERS, type HmoPartner } from "@/lib/clinic";

/** Uniform tile, so the row reads as a set regardless of logo proportions. */
const TILE = "flex h-24 w-52 shrink-0 items-center justify-center rounded-2xl bg-white px-5";

function PartnerTile({ partner }: { partner: HmoPartner }) {
  const [logoFailed, setLogoFailed] = useState(false);

  // Logos are dark on light, so they need a white tile to read against the
  // band. Anything without one — or whose file is missing — gets a pill, which
  // degrades to readable text rather than an empty white box.
  if (!partner.logo || logoFailed) {
    return (
      <li className="flex h-24 items-center rounded-full border border-white/[0.16] bg-white/[0.08] px-6 text-[0.95rem] font-semibold">
        {partner.name}
      </li>
    );
  }

  return (
    <li className={TILE}>
      <img
        src={partner.logo}
        alt={partner.fullName ?? partner.name}
        loading="lazy"
        onError={() => setLogoFailed(true)}
        style={{ maxHeight: partner.logoHeight ?? 48 }}
        className="max-w-full object-contain"
      />
    </li>
  );
}

export function Hmo() {
  return (
    <section id="hmo" className="bg-theatre-deep py-19 text-white md:py-26">
      <div className="mx-auto max-w-[1180px] px-6">
        <Reveal>
          <span className="mb-3.5 block font-mono text-[0.72rem] uppercase tracking-[0.18em] text-theatre-soft">
            Cover &amp; payment
          </span>
          <h2 className="text-[clamp(2rem,4vw,3.1rem)] text-white">Your HMO is welcome here.</h2>
          <p className="mt-5 max-w-[56ch] text-[1.05rem] text-white/70">
            Bring your enrolee ID and we&rsquo;ll verify cover before treatment begins — no surprise
            bills at the end of your visit. Not on a plan? We accept transfer, card and cash.
          </p>
        </Reveal>

        <Reveal delay={1}>
          <ul className="mt-9 flex flex-wrap items-center gap-4">
            {HMO_PARTNERS.map((partner) => (
              <PartnerTile key={partner.name} partner={partner} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}