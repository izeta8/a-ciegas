"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Trophy } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            A Ciegas
          </h1>
          <p className="text-xl text-slate-300">
            El juego de cartas español de intuición
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-slate-400 text-sm">
            Baraja española de 40 cartas (Fournier)
          </p>

          <div className="grid grid-cols-1 gap-3 text-left bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-3">Reglas:</h2>
            <p className="text-slate-300 text-sm">
              1. Adivina si la siguiente carta será <span className="text-red-400 font-semibold">Mayor</span>, <span className="text-blue-400 font-semibold">Menor</span> o <span className="text-purple-400 font-semibold">Igual</span>
            </p>
            <p className="text-slate-300 text-sm">
              2. Si las cartas son iguales y no dijiste "Igual", cuenta como falla
            </p>
            <p className="text-slate-300 text-sm">
              3. Al terminar el juego, tu puntuación es el número de fallas
            </p>
            <p className="text-slate-300 text-sm">
              4. ¡Menos fallas es mejor!
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/game">
            <Button size="lg" className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold text-lg">
              <Play className="w-5 h-5 mr-2" />
              Jugar Ahora
            </Button>
          </Link>

          <Button variant="ghost" size="lg" className="w-full text-slate-300">
            <Trophy className="w-5 h-5 mr-2" />
            Clasificación
          </Button>
        </div>
      </div>
    </div>
  )
}