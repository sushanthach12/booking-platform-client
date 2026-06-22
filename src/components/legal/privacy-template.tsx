import { ContactCta } from "./contact-cta";
import { PRIVACY_EFFECTIVE, PRIVACY_SECTIONS } from "./content/privacy.content";
import { InfoAccordion } from "./info-accordion";
import { InfoBody } from "./info-body";
import { InfoShell } from "./info-shell";

/** /privacy — Privacy Policy page. */
export function PrivacyTemplate() {
  const toc = PRIVACY_SECTIONS.map((s) => ({ id: s.id, label: s.title }));

  return (
    <InfoShell
      eyebrow="Legal — Privacy"
      title="Your privacy,"
      titleAccent="respected."
      intro="This policy explains what we collect, how we use it, and the control you have over your information on Stayly."
      meta={PRIVACY_EFFECTIVE}
    >
      <InfoBody toc={toc}>
        <InfoAccordion sections={PRIVACY_SECTIONS} />
        <ContactCta
          title="Questions about your data?"
          description="Our privacy team is happy to help with access, correction or deletion requests."
        />
      </InfoBody>
    </InfoShell>
  );
}
