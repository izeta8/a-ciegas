"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Trophy, Sparkles } from "lucide-react"

export default function HomePage() {
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
            El juego de cartas español de intuición
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

          <Button variant="outline" size="lg" className="w-full" disabled>
            <Trophy className="size-4" />
            Clasificación
          </Button>
        </div>
      </div>
    </main>
  )
}
