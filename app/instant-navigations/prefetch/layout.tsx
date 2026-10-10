import { PatternLayout } from "../_components/patterns";

export default function PrefetchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatternLayout pattern="instantPrefetch">{children}</PatternLayout>;
}
