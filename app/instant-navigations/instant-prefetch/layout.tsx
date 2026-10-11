import { PatternLayout } from "../_components/patterns";

export default function InstantPrefetchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatternLayout pattern="instantPrefetch">{children}</PatternLayout>;
}
