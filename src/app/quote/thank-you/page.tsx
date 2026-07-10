import type { Metadata } from "next";
import { CheckCircle2, PhoneCall, CalendarClock, FileCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { siteConfig, telLink, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your quote request has been received by Brite MJ Technologies.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/quote/thank-you" },
};

const steps = [
  {
    icon: PhoneCall,
    title: "We'll call to confirm",
    text: "A friendly member of our team will reach out to confirm your details and preferred inspection time.",
  },
  {
    icon: CalendarClock,
    title: "Free site inspection",
    text: "Our expert visits your property, assesses your needs, and answers all your questions — at no cost.",
  },
  {
    icon: FileCheck,
    title: "Your customized quote",
    text: "You receive a clear, tailored quote with the right solution for your property and budget.",
  },
];

export default function ThankYouPage() {
  return (
    <section className="section bg-surface">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-11 w-11 text-emerald-500" />
          </span>
          <h1 className="mt-6 font-heading text-3xl font-extrabold text-brand-950 md:text-4xl">
            Thank You! Your Request Is In.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            We&apos;ve received your quote request and a confirmation email is on
            its way. Our team will be in touch shortly to arrange your free site
            inspection.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-card"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-white">
                Step {i + 1}
              </span>
              <span className="mx-auto mt-3 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <step.icon className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-lg text-brand-950">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl bg-brand-950 p-8 text-center">
          <p className="text-lg font-semibold text-white">
            Need to reach us sooner?
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={telLink()} variant="white" size="lg">
              <PhoneCall className="h-5 w-5" /> Call {siteConfig.contact.phone}
            </Button>
            <Button href={whatsappLink()} variant="accent" size="lg" external>
              Chat on WhatsApp
            </Button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button href="/" variant="ghost">
            ← Back to Home
          </Button>
        </div>
      </Container>
    </section>
  );
}
