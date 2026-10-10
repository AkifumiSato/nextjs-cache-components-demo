import { PatternLayout } from "../_components/patterns";

export default function NavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatternLayout pattern="navigation">{children}</PatternLayout>;
}
