import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Staggers siblings; multiplied by 80ms. */
  delay?: 0 | 1 | 2;
  as?: ElementType;
};

export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delay * 80}ms` }}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "mb-3.5 block font-mono text-[0.72rem] uppercase tracking-[0.18em] text-coral",
        className,
      )}
      {...props}
    />
  );
}

export function Lede({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn("mt-5 max-w-[56ch] text-[1.05rem] text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Original Passy Dental Clinic logo. */
export function PassyLogo({ className }: { className?: string }) {
  return (
    <img
      src="/images/logo.png"
      alt="Passy Dental Clinic"
      width={246}
      height={235}
      fetchPriority="high"
      className={className}
    />
  );
}

/** WhatsApp glyph — used in the header CTA, form button and floating action. */
export function WhatsappGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}