import { PatternLayout } from "../_components/patterns";

export default function DynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatternLayout pattern="dynamic">{children}</PatternLayout>;
}
