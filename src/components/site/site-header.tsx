import { useEffect, useState } from "react";

import { PassyLogo } from "@/components/site/primitives";
import { useActiveSection } from "@/hooks/use-active-section";
import { NAV_LINKS } from "@/lib/clinic";
import { cn } from "@/lib/utils";

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));

export function SiteHeader() {
  const [stuck, setStuck] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,box-shadow,border-color] duration-300",
          stuck && "border-border bg-paper/90 backdrop-blur-[14px]",
        )}
      >
        <div className="mx-auto flex h-(--header-h) max-w-[1180px] items-center justify-between px-6">
          <a
            href="#top"
            className="flex items-center gap-2 shrink-0"
          >
            <PassyLogo className="h-16 w-auto" />
          </a>

          <nav className="hidden items-center gap-[30px] lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative py-1 text-[0.93rem] font-medium text-muted-foreground transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-coral after:transition-[width] after:duration-300 hover:text-foreground",
                    isActive && "text-foreground after:w-full",
                  )}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href="#book"
              className="inline-flex items-center rounded-full bg-theatre px-[22px] py-[11px] text-[0.97rem] font-semibold text-white shadow-[var(--shadow-cta)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-theatre-deep"
            >
              Book appointment
            </a>
          </nav>

          <button
            type="button"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen((open) => !open)}
            className="-mr-2.5 cursor-pointer p-2.5 lg:hidden"
          >
            <span
              className={cn(
                "block h-0.5 w-6 bg-foreground transition-transform duration-300",
                drawerOpen && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              className={cn(
                "my-[5px] block h-0.5 w-6 bg-foreground transition-opacity duration-300",
                drawerOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 bg-foreground transition-transform duration-300",
                drawerOpen && "-translate-y-[7px] -rotate-45",
              )}
            />
          </button>
        </div>
      </header>

      <div
        id="mobile-drawer"
        inert={!drawerOpen}
        className={cn(
          "fixed inset-x-0 top-(--header-h) z-40 border-b border-border bg-paper px-6 pb-8 pt-5 transition-transform duration-[400ms] ease-brand lg:hidden",
          drawerOpen ? "translate-y-0" : "-translate-y-[120%]",
        )}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setDrawerOpen(false)}
            className="block border-b border-border py-[15px] text-[1.1rem] font-medium"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#book"
          onClick={() => setDrawerOpen(false)}
          className="mt-[22px] inline-flex items-center rounded-full bg-theatre px-[26px] py-3.5 font-semibold text-white"
        >
          Book appointment
        </a>
      </div>
    </>
  );
}