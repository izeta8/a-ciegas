import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"
import { Header } from "@/components/Header"

export const metadata: Metadata = {
  title: "A Ciegas - juego de cartas",
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
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}