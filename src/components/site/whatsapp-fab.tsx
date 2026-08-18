import { WhatsappGlyph } from "@/components/site/primitives";
import { whatsappLink } from "@/lib/clinic";

export function WhatsappFab() {
  return (
    <a
      href={whatsappLink(
        "Hello Passy Dental Clinic, I'd like to ask about an appointment.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-[22px] right-[22px] z-30 grid size-[58px] place-items-center rounded-full bg-whatsapp shadow-[0_10px_28px_-8px_rgb(37_211_102/0.75)] transition-transform duration-200 ease-brand hover:scale-[1.09]"
    >
      <WhatsappGlyph className="size-[29px] text-white" />
    </a>
  );
}
