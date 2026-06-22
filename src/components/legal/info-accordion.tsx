"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface InfoSection {
  /** Stable id used as the accordion item value. */
  id: string;
  /** Heading shown on the trigger row. */
  title: string;
  /** Body paragraphs rendered in order. */
  body?: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
}

interface InfoAccordionProps {
  sections: InfoSection[];
  /** Item id to open on first paint. Defaults to the first section. */
  defaultOpenId?: string;
  /** Continue the running number from a previous group (Help groups its FAQs). */
  startIndex?: number;
}

/**
 * Card-styled accordion used across the legal/help pages. Numbered triggers and
 * the warm-accent index keep it visually consistent with the marketing sections.
 */
export function InfoAccordion({
  sections,
  defaultOpenId,
  startIndex = 0,
}: InfoAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpenId ?? sections[0]?.id}
      className="flex flex-col gap-3"
    >
      {sections.map((section, index) => (
        <AccordionItem
          key={section.id}
          id={section.id}
          value={section.id}
          className="scroll-mt-28 bg-card border border-border rounded-2xl px-5 md:px-6 overflow-hidden transition-colors hover:border-warm-accent/40"
        >
          <AccordionTrigger className="py-5 text-base md:text-[17px] font-semibold text-foreground hover:no-underline">
            <span className="flex items-baseline gap-4">
              <span
                className="font-mono shrink-0"
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  color: "#D9A05B",
                }}
              >
                {String(startIndex + index + 1).padStart(2, "0")}
              </span>
              <span style={{ letterSpacing: "-0.01em" }}>{section.title}</span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="pb-6 md:pl-10 md:pr-8">
            <div
              className="flex flex-col gap-3.5 text-muted-foreground"
              style={{ fontSize: "15px", lineHeight: "1.7" }}
            >
              {section.body?.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}

              {section.bullets?.length ? (
                <ul className="flex flex-col gap-2 pl-1">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full"
                        style={{ background: "#C2724A" }}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
