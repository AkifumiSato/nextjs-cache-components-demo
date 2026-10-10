import { PatternLayout } from "../_components/patterns";

export default function CachedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatternLayout pattern="instant">{children}</PatternLayout>;
}
