import { BecomeAHostTemplate } from "@/components/become-a-host/become-a-host-template";
import { Suspense } from "react";

export default function BecomeHost() {
  return (
    <Suspense>
      <BecomeAHostTemplate />
    </Suspense>
  )

}
