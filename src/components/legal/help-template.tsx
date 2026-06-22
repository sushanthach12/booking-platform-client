import { ContactCta } from "./contact-cta";
import { HELP_CATEGORIES } from "./content/help.content";
import { InfoAccordion } from "./info-accordion";
import { InfoBody } from "./info-body";
import { InfoShell } from "./info-shell";

/** /help — Help Center with FAQs grouped by topic. */
export function HelpTemplate() {
  const toc = HELP_CATEGORIES.map((c) => ({ id: c.id, label: c.title }));

  return (
    <InfoShell
      eyebrow="Help Center"
      title="How can we"
      titleAccent="help you?"
      intro="Answers to the questions guests and hosts ask us most. Can’t find what you need? We’re one message away."
    >
      <InfoBody toc={toc}>
        <div className="flex flex-col gap-12 md:gap-16">
          {HELP_CATEGORIES.map((category) => (
            <div key={category.id} id={category.id} className="scroll-mt-28">
              <div className="mb-5">
              <h2
                className="font-sans font-semibold text-foreground"
                style={{ fontSize: "24px", letterSpacing: "-0.02em" }}
              >
                {category.title}
              </h2>
              <p
                className="mt-1"
                style={{ fontSize: "15px", color: "#6B7A6E" }}
              >
                {category.description}
              </p>
            </div>
              <InfoAccordion sections={category.faqs} defaultOpenId="" />
            </div>
          ))}

          <ContactCta />
        </div>
      </InfoBody>
    </InfoShell>
  );
}
