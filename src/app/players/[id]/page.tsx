"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Trophy, Gamepad2, Loader2 } from "lucide-react"

type PlayerProfile = {
  id: string
  username: string
  avatar_url: string | null
}

type GameHistory = {
  id: string
  game_status: string
  misses: number
  completed_at: string | null
  updated_at: string
}

type PlayerStats = {
  games_played: number
  best_record: number | null
  profile: PlayerProfile
}

export default function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const supabase = createClient()
  
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null)
  const [games, setGames] = useState<GameHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", resolvedParams.id)
          .single()

        if (profileError || !profileData) {
          setError("Jugador no encontrado")
          setLoading(false)
          return
        }

        const { data: gamesData } = await supabase
          .from("games")
          .select("id, game_status, misses, completed_at, updated_at")
          .eq("user_id", resolvedParams.id)
          .in("game_status", ["completed", "abandoned"])
          .order("updated_at", { ascending: false })

        const completedGames = (gamesData || []).filter(g => g.game_status === "completed")
        const gamesPlayed = completedGames.length
        const bestRecord = completedGames.length > 0
          ? Math.min(...completedGames.map(g => g.misses))
          : null

        setPlayerStats({
          games_played: gamesPlayed,
          best_record: bestRecord,
          profile: profileData as PlayerProfile
        })
        setGames((gamesData || []) as GameHistory[])
      } catch (err) {
        console.error("Error fetching player:", err)
        setError("Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    fetchPlayerData()
  }, [resolvedParams.id, supabase])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </main>
    )
  }

  if (error || !playerStats) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">{error || "Jugador no encontrado"}</p>
            <Link href="/">
              <Button>Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  const { profile, games_played, best_record } = playerStats

  return (
    <main className="min-h-screen p-4 pb-20">
      <div className="max-w-sm mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Perfil de jugador</h1>
        </div>

        <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
          <Avatar className="h-16 w-16 shrink-0">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
            <AvatarFallback className="text-lg">
              {profile.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{profile.username}</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <Trophy className="size-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{best_record !== null ? best_record : '-'}</p>
              <p className="text-xs text-muted-foreground">Mejor récord</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <Gamepad2 className="size-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{games_played}</p>
              <p className="text-xs text-muted-foreground">Partidas terminadas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Historial de partidas</CardTitle>
            <CardDescription>{games.length} partidas registradas</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {games.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                Este jugador aún no ha completado ninguna partida
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left   font-medium text-muted-foreground">Fecha</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Faltas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {games.map((game) => (
                      <tr key={game.id} className="border-b last:border-b-0">
                        <td className="px-4 py-3">
                          <div>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              game.game_status === "completed" 
                                ? "bg-green-100 text-green-500 dark:bg-green-900/80 dark:text-green-400" 
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/80 dark:text-yellow-400"
                            }`}>
                              {game.game_status === "completed" ? "Completada" : "Abandonada"}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(game.completed_at || game.updated_at)}
                            </p>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3 text-center">
                          <span>
                            {game.misses}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}