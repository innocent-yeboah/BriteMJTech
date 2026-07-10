"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { whatsappLink, telLink, siteConfig } from "@/lib/site";

/**
 * Floating WhatsApp / contact widget shown on every page (bottom-right).
 * Expands to reveal WhatsApp chat and click-to-call options.
 */
export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div className="w-72 animate-fade-up overflow-hidden rounded-2xl bg-white shadow-card-hover ring-1 ring-slate-200">
          <div className="bg-[#075E54] px-4 py-3 text-white">
            <p className="text-sm font-semibold">Chat with Brite MJ</p>
            <p className="text-xs text-white/80">Typically replies within minutes</p>
          </div>
          <div className="space-y-2 p-4">
            <p className="text-sm text-slate-600">
              Hi there! How can we help secure your property today?
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1eb955]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Start WhatsApp Chat
            </a>
            <a
              href={telLink()}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-brand-950 transition-colors hover:bg-brand-50"
            >
              Call {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat options" : "Open WhatsApp chat"}
        aria-expanded={open}
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card-hover transition-all duration-300 hover:scale-105 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {open ? (
          <X className="h-7 w-7" />
        ) : (
          <MessageCircle className="h-7 w-7" />
        )}
        {!open && mounted ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-accent" />
          </span>
        ) : null}
      </button>
    </div>
  );
}
