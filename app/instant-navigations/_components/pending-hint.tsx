"use client";

import { useLinkStatus } from "next/link";

// Shows a spinner while the navigation is pending (i.e. blocking)
export function PendingHint() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={`inline-block size-3 rounded-full border-2 border-neutral-500 border-t-transparent animate-spin ${
        pending ? "visible" : "invisible"
      }`}
    />
  );
}
