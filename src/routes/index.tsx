import { createFileRoute } from "@tanstack/react-router";
import clinicHero from "@/assets/clinic-hero.jpg";
import clinicDentist from "@/assets/clinic-dentist.jpg";
import clinicMap from "@/assets/clinic-map.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Passy Dental Clinic — Modern Dentistry in Isolo, Lagos" },
      {
        name: "description",
        content:
          "Passy Dental Clinic at Jakande Gate, Isolo offers general dentistry, whitening, implants, orthodontics and pediatric care in a calm, modern setting.",
      },
      { property: "og:title", content: "Passy Dental Clinic — Modern Dentistry in Isolo, Lagos" },
      {
        property: "og:description",
        content:
          "Modern dental care at Crystall Mall, Jakande Gate, Isolo. Book your visit today.",
      },
    ],
  }),
  component: Index,
});

const services = [
  {
    title: "General Dentistry",
    desc: "Routine exams, fillings, and preventative care to keep your natural teeth healthy for life.",
    icon: <div className="size-5 border-2 border-primary rounded-sm" />,
  },
  {
    title: "Teeth Whitening",
    desc: "Advanced professional whitening systems that deliver visible results in a single visit.",
    icon: <div className="size-5 border-2 border-primary rounded-full" />,
  },
  {
    title: "Dental Implants",
    desc: "Modern restorative solutions for missing teeth that look, feel, and function like the real thing.",
    icon: <div className="size-5 border-2 border-primary rotate-45" />,
  },
  {
    title: "Orthodontics",
    desc: "Precision alignment services for children and adults using the latest orthodontic techniques.",
    icon: <div className="w-6 h-3 border-2 border-primary" />,
  },
  {
    title: "Pediatric Care",
    desc: "A friendly, fear-free environment specialised for our youngest patients in Isolo.",
    icon: <div className="size-4 bg-primary rounded-full" />,
  },
  {
    title: "Deep Cleaning",
    desc: "Professional hygiene sessions that remove plaque and tartar build-up to prevent gum disease.",
    icon: <div className="size-5 border-2 border-dashed border-primary rounded-full" />,
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-[Inter,sans-serif] selection:bg-primary/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="size-3 bg-background rounded-full" />
            </div>
            <span className="font-bold tracking-tight text-lg">Passy Dental</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#about" className="hover:text-primary transition-colors">Our Practice</a>
            <a href="#location" className="hover:text-primary transition-colors">Location</a>
          </div>
          <a
            href="#location"
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Book Visit
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Now Welcoming Patients in Isolo
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-balance leading-[0.9] mb-8">
              Exceptional dental care at{" "}
              <span className="text-primary">Jakande Gate.</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-xl mb-10 leading-relaxed">
              Passy Dental Clinic combines modern technology with a gentle touch. Located at Crystall Computer &amp; Shopping Mall, we bring world-class dentistry to the heart of Isolo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#location"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all text-center"
              >
                Schedule Appointment
              </a>
              <a
                href="#services"
                className="px-8 py-4 bg-card border border-border rounded-2xl font-bold text-lg hover:bg-secondary transition-colors text-center"
              >
                View Services
              </a>
            </div>
          </div>
        </div>
        <div className="absolute top-20 right-[-10%] w-1/2 hidden lg:block">
          <img
            src={clinicHero}
            alt="Sunlit, modern dental consultation room at Passy Dental Clinic"
            width={1216}
            height={1408}
            className="w-full aspect-[4/5] object-cover rounded-[40px] outline-1 -outline-offset-1 outline-black/5"
          />
        </div>
      </header>

      {/* Services */}
      <section id="services" className="py-24 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <p className="font-[JetBrains_Mono,monospace] text-xs text-primary uppercase tracking-widest mb-4">
                Our Expertise
              </p>
              <h2 className="text-4xl font-bold tracking-tight">
                Comprehensive care for every smile.
              </h2>
            </div>
            <p className="text-muted-foreground max-w-xs">
              From routine hygiene to advanced structural restoration, we handle everything under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-3xl overflow-hidden">
            {services.map((s) => (
              <div key={s.title} className="bg-card p-10 hover:bg-secondary transition-colors">
                <div className="size-12 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-center mb-6">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <img
              src={clinicDentist}
              alt="Friendly dentist at Passy Dental Clinic"
              width={1024}
              height={1216}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover rounded-[32px]"
            />
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-8">
                Modern dentistry meets local community care.
              </h2>
              <div className="space-y-8">
                {[
                  {
                    n: "01",
                    h: "Advanced Diagnostics",
                    p: "We use digital X-rays and intraoral cameras for precise diagnosis and patient education.",
                  },
                  {
                    n: "02",
                    h: "Patient Comfort",
                    p: "Our clinic is designed to be a sanctuary, reducing dental anxiety through a calm, well-lit atmosphere.",
                  },
                  {
                    n: "03",
                    h: "Jakande Gate Location",
                    p: "Conveniently situated in Crystall Mall, making high-quality dental care accessible for Isolo residents.",
                  },
                ].map((item) => (
                  <div key={item.n} className="flex gap-6">
                    <span className="text-primary font-[JetBrains_Mono,monospace] text-lg font-bold">
                      {item.n}
                    </span>
                    <div>
                      <h3 className="font-bold mb-2">{item.h}</h3>
                      <p className="text-muted-foreground text-sm">{item.p}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-3xl font-medium italic leading-tight">
                "I've always been nervous about dentists, but the team at Passy made me feel so at ease. The clinic is incredibly clean and modern."
              </p>
              <p className="font-[JetBrains_Mono,monospace] text-xs uppercase tracking-widest opacity-60">
                — Emeka O., Isolo
              </p>
            </div>
            <div className="space-y-6">
              <p className="text-3xl font-medium italic leading-tight">
                "The best whitening treatment I've had in Lagos. Professional service and zero pain. Highly recommend the team at Jakande Gate."
              </p>
              <p className="font-[JetBrains_Mono,monospace] text-xs uppercase tracking-widest opacity-60">
                — Sarah A., Okota
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-card rounded-[40px] border border-border p-8 md:p-16 grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-8">
                Find us in the heart of Isolo.
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="font-[JetBrains_Mono,monospace] text-[10px] uppercase tracking-widest text-primary mb-2">
                    Address
                  </p>
                  <p className="text-xl font-medium">
                    Crystall Computer &amp; Shopping Mall,
                    <br />
                    Jakande Gate Bus-stop, Isheri Oshun Rd,
                    <br />
                    Isolo, Lagos 102214, Nigeria.
                  </p>
                </div>
                <div>
                  <p className="font-[JetBrains_Mono,monospace] text-[10px] uppercase tracking-widest text-primary mb-2">
                    Opening Hours
                  </p>
                  <p className="text-muted-foreground">
                    Monday — Saturday: 8:00 AM – 6:00 PM
                    <br />
                    Sunday: By Appointment Only
                  </p>
                </div>
                <div className="pt-4">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Passy+Dental+Clinic+Crystall+Mall+Jakande+Gate+Isolo+Lagos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline underline-offset-4"
                  >
                    Get Directions on Map →
                  </a>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={clinicMap}
                alt="Map showing Passy Dental Clinic location at Jakande Gate, Isolo, Lagos"
                width={800}
                height={800}
                loading="lazy"
                className="w-full aspect-square object-cover rounded-3xl outline-1 -outline-offset-1 outline-black/5"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-8 rounded-2xl shadow-xl hidden md:block">
                <p className="font-[JetBrains_Mono,monospace] text-[10px] uppercase tracking-widest opacity-70 mb-1">
                  Call Us Directly
                </p>
                <p className="text-2xl font-bold tracking-tight">+234 800 000 0000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-primary/20 rounded-md flex items-center justify-center">
              <div className="size-2 bg-primary rounded-full" />
            </div>
            <span className="font-bold tracking-tight">Passy Dental Clinic</span>
          </div>
          <p className="text-xs text-muted-foreground font-[JetBrains_Mono,monospace] uppercase tracking-widest">
            © {new Date().getFullYear()} — Locally Owned &amp; Operated in Lagos
          </p>
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
