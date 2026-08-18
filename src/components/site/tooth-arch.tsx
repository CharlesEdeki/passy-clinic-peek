import { useMemo } from "react";

import { useToothSelection } from "@/components/site/tooth-selection";
import { cn } from "@/lib/utils";

const TEETH_PER_ARCH = 16;

type Tooth = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

function regionOf(index: number) {
  const distanceFromMidline = Math.abs(index - 7.5);
  if (distanceFromMidline < 1) return "central incisor";
  if (distanceFromMidline < 2) return "lateral incisor";
  if (distanceFromMidline < 3) return "canine";
  if (distanceFromMidline < 5) return "premolar";
  return "molar";
}

/** Lays 16 teeth around half an ellipse — upper arch curves up, lower curves down. */
function buildArch(centerY: number, radiusX: number, radiusY: number, upper: boolean): Tooth[] {
  return Array.from({ length: TEETH_PER_ARCH }, (_, index) => {
    const angle = (Math.PI * (index + 0.5)) / TEETH_PER_ARCH;
    const x = 170 - radiusX * Math.cos(angle);
    const y = centerY + (upper ? -1 : 1) * radiusY * Math.sin(angle);
    const region = regionOf(index);
    const width = region === "molar" ? 17 : region === "premolar" ? 14 : 12;
    const height = region === "molar" ? 16 : 19;
    const degrees = ((angle * 180) / Math.PI - 90) * (upper ? -1 : 1);

    return {
      id: `${upper ? "u" : "l"}${index}`,
      label: `${upper ? "Upper" : "Lower"} ${index < 8 ? "right" : "left"} ${region}`,
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
      rotation: degrees,
    };
  });
}

export function ToothArch() {
  const { selected, toggle, clear, isSelected } = useToothSelection();

  const teeth = useMemo(
    () => [...buildArch(140, 130, 105, true), ...buildArch(160, 130, 105, false)],
    [],
  );

  return (
    <div className="rounded-[28px] bg-theatre-deep p-[30px] text-white shadow-[0_30px_60px_-30px_rgb(14_33_28/0.6)]">
      <h3 className="text-[1.05rem] text-white">Where does it hurt?</h3>
      <p className="mt-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/55">
        Tap a tooth — we&rsquo;ll add it to your booking
      </p>

      <svg
        viewBox="0 0 340 300"
        role="group"
        aria-label="Interactive dental arch"
        className="my-3.5 h-auto w-full touch-manipulation"
      >
        {teeth.map((tooth) => {
          const on = isSelected(tooth.label);
          return (
            <rect
              key={tooth.id}
              x={tooth.x}
              y={tooth.y}
              width={tooth.width}
              height={tooth.height}
              rx={5}
              transform={`rotate(${tooth.rotation} ${tooth.x + tooth.width / 2} ${tooth.y + tooth.height / 2})`}
              tabIndex={0}
              role="button"
              aria-pressed={on}
              aria-label={tooth.label}
              onClick={() => toggle(tooth.label)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggle(tooth.label);
                }
              }}
              className={cn(
                "cursor-pointer stroke-theatre-deep stroke-2 transition-[fill] duration-200",
                on ? "fill-coral" : "fill-[#EFF5F2] hover:fill-mint",
              )}
            />
          );
        })}
      </svg>

      <div className="mt-3 space-y-3">
        <div className="flex min-h-[52px] items-center justify-between gap-3 rounded-[14px] bg-white/[0.09] px-4 py-[13px] text-[0.87rem]">
          <span>
            {selected.length === 0
              ? "Nothing selected yet"
              : `${selected.length} ${selected.length === 1 ? "area" : "areas"}: ${selected.join(", ")}`}
          </span>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="shrink-0 cursor-pointer text-[0.83rem] font-semibold text-coral"
            >
              Clear
            </button>
          )}
        </div>

        {selected.length > 0 ? (
          <a
            href="#book"
            className="inline-flex w-full items-center justify-center rounded-[14px] bg-coral px-4 py-3 text-center text-[0.9rem] font-semibold text-white transition-opacity hover:opacity-95"
          >
            {selected.length === 1 ? "Book for this tooth" : `Book for these ${selected.length} areas`}
          </a>
        ) : (
          <p className="text-center text-[0.72rem] uppercase tracking-[0.12em] text-white/60">
            Select a tooth, then book below
          </p>
        )}
      </div>
    </div>
  );
}