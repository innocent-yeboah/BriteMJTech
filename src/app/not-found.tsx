import { MarketingShell } from "@/components/layout/marketing-shell";
import {
  NotFoundContent,
  notFoundMetadata,
} from "@/components/layout/not-found-content";

export const metadata = notFoundMetadata;

/** Unmatched URLs render here, outside the marketing route group. */
export default function NotFound() {
  return (
    <MarketingShell>
      <NotFoundContent />
    </MarketingShell>
  );
}
