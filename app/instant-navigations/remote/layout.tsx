import { PatternLayout } from "../_components/patterns";

export default function RemoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatternLayout pattern="remote">{children}</PatternLayout>;
}
