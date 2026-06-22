import { ContactCta } from "./contact-cta";
import { TERMS_EFFECTIVE, TERMS_SECTIONS } from "./content/terms.content";
import { InfoAccordion } from "./info-accordion";
import { InfoBody } from "./info-body";
import { InfoShell } from "./info-shell";

/** /terms — Terms of Service page. */
export function TermsTemplate() {
  const toc = TERMS_SECTIONS.map((s) => ({ id: s.id, label: s.title }));

  return (
    <InfoShell
      eyebrow="Legal — Terms"
      title="The terms we"
      titleAccent="play by."
      intro="The agreement between you and Stayly when you book a stay or list your place. Plain language, no surprises."
      meta={TERMS_EFFECTIVE}
    >
      <InfoBody toc={toc}>
        <InfoAccordion sections={TERMS_SECTIONS} />
        <ContactCta />
      </InfoBody>
    </InfoShell>
  );
}
