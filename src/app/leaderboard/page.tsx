"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, ArrowLeft, Loader2, Crown } from "lucide-react"

interface LeaderboardEntry {
  userId: string
  username: string
  misses: number
  completed_at: string
  avatar_url: string | null
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabaseRef = useRef(createClient())

  useEffect(() => {
    const supabase = supabaseRef.current
    const fetchLeaderboard = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from("games")
          .select(`
            user_id,
            misses,
            completed_at,
            profiles:user_id (
              username,
              avatar_url
            )
          `)
          .eq("game_status", "completed")
          .order("misses", { ascending: true })

        if (dbError) throw dbError

        const bestByUser = new Map<string, LeaderboardEntry>()
        for (const game of (data || [])) {
          const userId = game.user_id
          if (!bestByUser.has(userId)) {
            bestByUser.set(userId, {
              userId: game.user_id,
              misses: game.misses,
              completed_at: game.completed_at,
              username: (game.profiles as unknown as { username: string; avatar_url: string | null } | null)?.username || "Anónimo",
              avatar_url: (game.profiles as unknown as { username: string; avatar_url: string | null } | null)?.avatar_url || null,
            })
          }
        }

        setEntries(Array.from(bestByUser.values()).slice(0, 10))
      } catch (err) {
        console.error("Error fetching leaderboard:", err)
        setError("No se pudo cargar la clasificación")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Trophy className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Clasificación</h1>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        ) : entries.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sin puntuaciones aún</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-sm mb-4">
                ¡Sé el primero en completar una partida!
              </p>
              <Link href="/game">
                <Button>Jugar Ahora</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {entries.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="flex items-center justify-center w-8 shrink-0">
                      {index === 0 ? (
                        <Crown className="size-6 text-yellow-500" />
                      ) : (
                        <span className="text-lg font-semibold text-muted-foreground">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {entry.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(entry.completed_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-2xl font-bold text-primary">
                        {entry.misses}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {entry.misses === 1 ? "falta" : "faltas"}
                      </span>
                    </div>

                    <Link href={`/players/${entry.userId}`}>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Ver perfil
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
