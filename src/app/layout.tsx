import "./styles/globals.css";
import { Providers } from "./components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Metrô SP",
  description: "Aprenda todas as linhas, estações e baldeações do metrô de São Paulo",
  openGraph: {
    title: "Quiz Metrô SP",
    description: "Aprenda todas as linhas, estações e baldeações do metrô de São Paulo",
    images: ["/dica.webp"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz Metrô SP",
    description: "Aprenda todas as linhas, estações e baldeações do metrô de São Paulo",
    images: ["/dica.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
