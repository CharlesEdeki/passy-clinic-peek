import { useEffect } from "react";

const SCRIPT_SRC = "https://widgets.sociablekit.com/google-reviews/widget.js";

export function GoogleReviews() {
  useEffect(() => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section className="py-24 bg-background border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <p className="font-[JetBrains_Mono,monospace] text-xs text-brand-red uppercase tracking-widest mb-4">
            Patient Reviews
          </p>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            What our patients say on Google.
          </h2>
          <p className="text-muted-foreground">
            Real, verified reviews from people we've cared for at Jakande Gate, Isolo.
          </p>
        </div>
        <div className="sk-ww-google-reviews" data-embed-id="25699874" />
      </div>
    </section>
  );
}