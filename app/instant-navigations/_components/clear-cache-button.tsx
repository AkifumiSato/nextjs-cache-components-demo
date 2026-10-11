"use client";

import { useTransition } from "react";
import { clearCaches } from "../_lib/actions";

export function ClearCacheButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => clearCaches())}
      className="rounded-lg border border-neutral-700/60 bg-neutral-800/60 px-3 py-1.5 text-sm text-neutral-100 transition-colors hover:border-neutral-500 hover:bg-neutral-800 disabled:opacity-50"
    >
      {pending ? "クリア中…" : "キャッシュをすべてクリア"}
    </button>
  );
}
