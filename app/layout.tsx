"use cache";

import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-dvh flex flex-col font-sans antialiased">
        <Header />
        <main className="grow w-full max-w-5xl mx-auto px-8 py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
