// TODO: Become a host page — disabled, will improve in future
import { redirect } from "next/navigation";

export default function BecomeHost() {
  redirect("/");

  // return (
  //   <Suspense>
  //     <BecomeAHostTemplate />
  //   </Suspense>
  // )
}
