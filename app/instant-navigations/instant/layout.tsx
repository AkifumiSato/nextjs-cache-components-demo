import { PatternLayout } from "../_components/patterns";

export default function InstantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatternLayout pattern="instant">{children}</PatternLayout>;
}
