import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "A Ciegas - juego de cartas español",
  description: "Adivina si la siguiente carta es Mayor, Menor o Igual",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}