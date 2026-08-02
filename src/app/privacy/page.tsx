import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/legal-page";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How Brite MJ Technologies collects, uses, stores, and protects personal information from website visitors, quote requests, and customers in Ghana.",
  path: "/privacy",
  keywords: [
    "Brite MJ Technologies privacy policy",
    "security company Accra data protection",
    "Ghana website privacy policy",
  ],
});

const EFFECTIVE = "2026-08-02";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="We explain what personal information we collect, why we use it, and the choices you have — in clear language."
      path="/privacy"
      breadcrumbLabel="Privacy Policy"
      effectiveDate={EFFECTIVE}
      sections={[
        {
          id: "who-we-are",
          title: "Who we are",
          content: (
            <>
              <p>
                This Privacy Policy applies to{" "}
                <strong>{siteConfig.name}</strong> (“we”, “us”, “our”), a
                security and smart systems company based at{" "}
                {siteConfig.address.full}. Our website is{" "}
                <a href={siteConfig.url}>{siteConfig.url.replace(/^https?:\/\//, "")}</a>.
              </p>
              <p>
                For privacy questions, contact us at{" "}
                <a href={`mailto:${siteConfig.contact.email}`}>
                  {siteConfig.contact.email}
                </a>{" "}
                or call{" "}
                <a href={`tel:${siteConfig.contact.phone}`}>
                  {siteConfig.contact.phone}
                </a>
                .
              </p>
            </>
          ),
        },
        {
          id: "scope",
          title: "Scope",
          content: (
            <>
              <p>This policy covers personal information collected through:</p>
              <ul>
                <li>Our website forms (quote, contact, newsletter)</li>
                <li>Phone, WhatsApp, email, and in-person enquiries</li>
                <li>Our staff admin tools used to manage leads and projects</li>
              </ul>
              <p>
                It does not cover third-party websites linked from our pages
                (social media, payment providers, or partner sites).
              </p>
            </>
          ),
        },
        {
          id: "what-we-collect",
          title: "Information we collect",
          content: (
            <>
              <p>Depending on how you contact us, we may collect:</p>
              <ul>
                <li>
                  <strong>Identity & contact:</strong> name, email address,
                  phone number
                </li>
                <li>
                  <strong>Project details:</strong> property type/size, services
                  of interest, messages, preferred inspection date/time
                </li>
                <li>
                  <strong>Newsletter:</strong> email address if you subscribe
                </li>
                <li>
                  <strong>Technical data:</strong> basic server logs such as IP
                  address, browser type, and pages requested (for security and
                  reliability)
                </li>
              </ul>
              <p>
                We do not ask for payment card details on this website. If
                payments are arranged later, they are handled through agreed
                business channels.
              </p>
            </>
          ),
        },
        {
          id: "how-we-use",
          title: "How we use your information",
          content: (
            <>
              <p>We use personal information to:</p>
              <ul>
                <li>Respond to quote requests, enquiries, and support needs</li>
                <li>Schedule site inspections and prepare proposals</li>
                <li>Deliver and manage security installation projects</li>
                <li>
                  Send transactional messages (for example, confirmation that we
                  received your request)
                </li>
                <li>
                  Send optional tips or offers if you subscribe to our newsletter
                </li>
                <li>Improve our website, prevent abuse, and keep systems secure</li>
                <li>Meet legal, accounting, and regulatory obligations</li>
              </ul>
            </>
          ),
        },
        {
          id: "legal-bases",
          title: "Legal bases",
          content: (
            <>
              <p>
                We process personal information under Ghana’s Data Protection Act,
                2012 (Act 843) and, where relevant for international visitors,
                comparable principles such as:
              </p>
              <ul>
                <li>
                  <strong>Contract / pre-contract steps</strong> — to respond to
                  your request for services
                </li>
                <li>
                  <strong>Legitimate interests</strong> — to run and secure our
                  business, provided those interests are not overridden by your
                  rights
                </li>
                <li>
                  <strong>Consent</strong> — for optional marketing such as
                  newsletter emails (you can unsubscribe at any time)
                </li>
                <li>
                  <strong>Legal obligation</strong> — where the law requires us
                  to keep or disclose records
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "sharing",
          title: "How we share information",
          content: (
            <>
              <p>
                We do not sell your personal information. We share it only with:
              </p>
              <ul>
                <li>
                  <strong>Service providers</strong> who help us operate — for
                  example hosting (Vercel), database (Supabase), and email
                  delivery (Resend) — under agreements that limit use to
                  providing those services
                </li>
                <li>
                  <strong>Staff and contractors</strong> who need access to
                  fulfil your request
                </li>
                <li>
                  <strong>Authorities</strong> when required by law or to protect
                  rights, safety, or security
                </li>
              </ul>
              <p>
                Some providers may process data outside Ghana. Where that
                happens, we use reputable vendors and contractual safeguards
                appropriate to the service.
              </p>
            </>
          ),
        },
        {
          id: "retention",
          title: "Retention",
          content: (
            <>
              <p>
                We keep personal information only as long as needed for the
                purposes above:
              </p>
              <ul>
                <li>
                  Lead and enquiry records — typically for the life of the
                  customer relationship and a reasonable period afterward for
                  follow-up, warranty, and accounting
                </li>
                <li>
                  Newsletter subscriptions — until you unsubscribe or we close
                  the list
                </li>
                <li>Server logs — for a short operational period unless needed for security investigations</li>
              </ul>
            </>
          ),
        },
        {
          id: "security",
          title: "Security",
          content: (
            <>
              <p>
                We use technical and organisational measures appropriate to the
                risk, including HTTPS, access-controlled admin accounts, and
                restricted database policies. No method of transmission or
                storage is 100% secure; if you suspect unauthorised use of your
                information, contact us promptly.
              </p>
            </>
          ),
        },
        {
          id: "your-rights",
          title: "Your rights",
          content: (
            <>
              <p>Subject to applicable law, you may request to:</p>
              <ul>
                <li>Access the personal information we hold about you</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete information we no longer need to keep</li>
                <li>Object to or restrict certain processing</li>
                <li>Withdraw marketing consent (newsletter) at any time</li>
              </ul>
              <p>
                To exercise these rights, email{" "}
                <a href={`mailto:${siteConfig.contact.email}`}>
                  {siteConfig.contact.email}
                </a>{" "}
                with enough detail for us to verify and respond. You may also
                lodge a complaint with Ghana’s Data Protection Commission.
              </p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Cookies and similar technologies",
          content: (
            <>
              <p>
                Our site uses essential cookies and similar technologies needed
                for security, session management (for staff login), and basic
                site operation. We do not currently run third-party advertising
                trackers on this website. If we add analytics or marketing
                cookies later, we will update this policy and, where required,
                provide a consent choice.
              </p>
            </>
          ),
        },
        {
          id: "children",
          title: "Children",
          content: (
            <>
              <p>
                Our services are directed to adults and organisations. We do not
                knowingly collect personal information from children under 16. If
                you believe a child has submitted information, contact us and we
                will delete it.
              </p>
            </>
          ),
        },
        {
          id: "changes",
          title: "Changes to this policy",
          content: (
            <>
              <p>
                We may update this Privacy Policy from time to time. The
                effective date at the top will change when we do. Continued use
                of the website after updates means you acknowledge the revised
                policy. Material changes may also be highlighted on the site or
                by email where appropriate.
              </p>
              <p>
                Related:{" "}
                <Link href="/terms">Terms of Service</Link>.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
