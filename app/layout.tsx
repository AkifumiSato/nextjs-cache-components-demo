"use cache";

import { Footer } from "./_components/footer";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-90dvh flex flex-col antialiased">
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
