import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/legal-page";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Terms governing use of the Brite MJ Technologies website and related enquiries for security and smart systems services in Accra, Ghana.",
  path: "/terms",
  keywords: [
    "Brite MJ Technologies terms of service",
    "security installation Accra terms",
    "website terms Ghana",
  ],
});

const EFFECTIVE = "2026-08-02";

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="These terms govern your use of our website and how online enquiries relate to our security services."
      path="/terms"
      breadcrumbLabel="Terms of Service"
      effectiveDate={EFFECTIVE}
      sections={[
        {
          id: "agreement",
          title: "Agreement",
          content: (
            <>
              <p>
                By accessing{" "}
                <a href={siteConfig.url}>
                  {siteConfig.url.replace(/^https?:\/\//, "")}
                </a>{" "}
                or submitting a form, you agree to these Terms of Service and
                our <Link href="/privacy">Privacy Policy</Link>. If you do not
                agree, please do not use the site.
              </p>
              <p>
                These terms are between you and{" "}
                <strong>{siteConfig.name}</strong>, {siteConfig.address.full}.
              </p>
            </>
          ),
        },
        {
          id: "services",
          title: "Our services",
          content: (
            <>
              <p>
                We design and install security and smart systems (including
                CCTV, fencing, networking, access control, and related
                solutions) primarily in Accra and Greater Accra, Ghana.
              </p>
              <p>
                Content on this website is for general information. A website
                quote request, brochure description, or estimated price range is{" "}
                <strong>not</strong> a binding offer or contract. Formal
                quotations, scopes of work, warranties, and payment terms are
                confirmed in writing after assessment (often including a site
                inspection).
              </p>
            </>
          ),
        },
        {
          id: "website-use",
          title: "Acceptable use of the website",
          content: (
            <>
              <p>You agree not to:</p>
              <ul>
                <li>Use the site for unlawful, harmful, or fraudulent purposes</li>
                <li>
                  Attempt to gain unauthorised access to our systems, admin
                  areas, or other users’ data
                </li>
                <li>
                  Submit malware, spam, or automated abuse through our forms
                </li>
                <li>
                  Copy, scrape, or republish substantial site content without
                  permission, except as allowed by law
                </li>
                <li>
                  Misrepresent your identity or affiliation when contacting us
                </li>
              </ul>
              <p>
                We may suspend or restrict access if we reasonably believe these
                terms are violated.
              </p>
            </>
          ),
        },
        {
          id: "enquiries",
          title: "Enquiries, quotes, and appointments",
          content: (
            <>
              <p>
                When you submit a quote or contact form, you confirm that the
                information you provide is accurate to the best of your
                knowledge and that we may contact you by phone, WhatsApp, or
                email about your request.
              </p>
              <p>
                Free site inspections and consultations are offered subject to
                availability and service area. We may decline or reschedule
                appointments where access, safety, or coverage makes work
                impractical.
              </p>
            </>
          ),
        },
        {
          id: "contracts",
          title: "Installation contracts",
          content: (
            <>
              <p>
                If you proceed with installation, the binding terms will be those
                set out in the quotation, invoice, work order, or written
                agreement we provide (including scope, materials, timeline,
                payment schedule, and warranty). Those project documents prevail
                over general website wording if there is a conflict.
              </p>
            </>
          ),
        },
        {
          id: "intellectual-property",
          title: "Intellectual property",
          content: (
            <>
              <p>
                Website text, branding, logos, photographs, videos, and design
                elements are owned by {siteConfig.name} or our licensors. You
                may view and print pages for personal, non-commercial use. Any
                other use requires our prior written consent.
              </p>
            </>
          ),
        },
        {
          id: "third-parties",
          title: "Third-party links and tools",
          content: (
            <>
              <p>
                The site may link to WhatsApp, social networks, maps, or other
                third parties. We are not responsible for their content,
                availability, or privacy practices. Use of those services is
                subject to their own terms.
              </p>
            </>
          ),
        },
        {
          id: "disclaimer",
          title: "Disclaimer",
          content: (
            <>
              <p>
                The website is provided on an “as is” and “as available” basis.
                While we aim for accuracy and uptime, we do not warrant that the
                site will be uninterrupted, error-free, or that all information
                is complete for every property or use case. Security outcomes
                depend on correct system design, installation conditions, user
                practices, and factors outside our control.
              </p>
            </>
          ),
        },
        {
          id: "liability",
          title: "Limitation of liability",
          content: (
            <>
              <p>
                To the fullest extent permitted by Ghanaian law, {siteConfig.name}{" "}
                is not liable for indirect, incidental, special, or
                consequential losses arising from website use (including loss of
                profits, data, or business opportunity). Nothing in these terms
                excludes liability that cannot be excluded by law (including
                fraud or death/personal injury caused by negligence where such
                exclusion is prohibited).
              </p>
              <p>
                Liability for contracted installation work is governed by the
                applicable project agreement and applicable law.
              </p>
            </>
          ),
        },
        {
          id: "indemnity",
          title: "Indemnity",
          content: (
            <>
              <p>
                You agree to indemnify and hold us harmless from claims arising
                out of your misuse of the website, your breach of these terms,
                or your submission of unlawful or infringing content through our
                forms, except to the extent caused by our wilful misconduct.
              </p>
            </>
          ),
        },
        {
          id: "governing-law",
          title: "Governing law",
          content: (
            <>
              <p>
                These terms are governed by the laws of the Republic of Ghana.
                Courts in Ghana have exclusive jurisdiction, without prejudice
                to any mandatory consumer protections that may apply.
              </p>
            </>
          ),
        },
        {
          id: "changes",
          title: "Changes",
          content: (
            <>
              <p>
                We may update these Terms of Service periodically. The effective
                date above will be revised when changes are published. Continued
                use of the website after changes constitutes acceptance of the
                updated terms.
              </p>
              <p>
                Questions?{" "}
                <Link href="/contact">Contact us</Link> or email{" "}
                <a href={`mailto:${siteConfig.contact.email}`}>
                  {siteConfig.contact.email}
                </a>
                .
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
