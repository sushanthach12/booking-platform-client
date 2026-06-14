import { toast } from "sonner";

/**
 * Surface an error to the user as a toast — never as an inline card or banner.
 * Pass `retry` to attach a "Retry" action (typically a hook's reload function).
 *
 * @param error    The caught error; its `message` is shown when it's an `Error`.
 * @param fallback Message used when `error` isn't an `Error` instance.
 * @param retry    Optional callback wired to a "Retry" action button.
 */
export function toastError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
  retry?: () => void,
): void {
  const message = error instanceof Error ? error.message : fallback;
  toast.error(
    message,
    retry ? { action: { label: "Retry", onClick: retry } } : undefined,
  );
}

/** Surface a success confirmation to the user as a toast. */
export function toastSuccess(message: string): void {
  toast.success(message);
}
