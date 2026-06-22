import { InfoShell } from "@/components/legal";
import { ContactView } from "./contact-view";

/** /contact — reachable support details and a message form. */
export function ContactTemplate() {
  return (
    <InfoShell
      eyebrow="Get in touch"
      title="We'd love to"
      titleAccent="hear from you."
      intro="Questions about a booking, your listing or anything else? Reach us by email or phone, or send a message below."
    >
      <ContactView />
    </InfoShell>
  );
}
