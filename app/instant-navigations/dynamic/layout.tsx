import { PatternLayout } from "../_components/patterns";

export default function DynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatternLayout pattern="legacy">{children}</PatternLayout>;
}
