export default function InstantNavigationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h1 className="text-2xl font-semibold text-neutral-100">
          Instant Navigations
        </h1>
      </div>
      {children}
    </div>
  );
}
