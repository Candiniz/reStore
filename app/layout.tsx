import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "reStore | Restaurador de Imagens",
  description: "Restaure seus maiores tesouros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}
