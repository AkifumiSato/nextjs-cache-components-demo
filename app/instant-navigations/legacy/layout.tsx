import { PatternLayout } from "../_components/patterns";

export default function LegacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatternLayout pattern="legacy">{children}</PatternLayout>;
}
