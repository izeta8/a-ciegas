"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { Play, Trophy, Sparkles, LogOut } from "lucide-react"

export default function HomePage() {
  const { user, signOut, signInWithGoogle, isLoading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  const handleSignIn = async () => {
    await signInWithGoogle()
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center size-14 sm:size-16 rounded-full bg-primary mb-4">
            <Sparkles className="size-7 sm:size-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            A Ciegas
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            El juego de cartas de intuición
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Reglas</CardTitle>
            <CardDescription className="text-sm">Baraja española de 40 cartas (Fournier)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <p className="text-muted-foreground">
              1. Adivina si la siguiente carta será{" "}
              <span className="font-medium text-foreground">Mayor</span>,{" "}
              <span className="font-medium text-foreground">Menor</span> o{" "}
              <span className="font-medium text-foreground">Igual</span>
            </p>
            <p className="text-muted-foreground">
              2. Si las cartas son iguales y no dijiste &quot;Igual&quot;, cuenta como falla
            </p>
            <p className="text-muted-foreground">
              3. Tu puntuación es el número de fallas al terminar
            </p>
            <p className="text-muted-foreground">
              4. ¡Menos fallas es mejor!
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Link href="/game" className="w-full">
            <Button size="lg" className="w-full font-semibold">
              <Play className="size-4" />
              Jugar Ahora
            </Button>
          </Link>

          {user ? (
            <Button variant="outline" size="lg" className="w-full" onClick={handleSignOut}>
              <LogOut className="size-4" />
              Cerrar sesión
            </Button>
          ) : (
            <Button variant="outline" size="lg" className="w-full" onClick={handleSignIn} disabled={isLoading}>
              <svg className="size-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Iniciar sesión
            </Button>
          )}

          <Link href="/leaderboard">
            <Button variant="outline" size="lg" className="w-full">
              <Trophy className="size-4" />
              Clasificación
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}