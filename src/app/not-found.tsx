import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section bg-surface">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <p className="font-heading text-6xl font-extrabold text-accent">404</p>
          <h1 className="mt-4 text-3xl text-brand-950">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-3 text-slate-600">
            The page you&apos;re looking for may have moved. Let&apos;s get you
            back on track.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/" variant="accent" size="lg">
              Back to Home
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
