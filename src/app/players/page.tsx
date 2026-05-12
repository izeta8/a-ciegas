"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Users, Trophy, Loader2 } from "lucide-react"

type PlayerStats = {
  id: string
  username: string
  avatar_url: string | null
  games_played: number
  best_record: number | null
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<PlayerStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            id,
            username,
            avatar_url,
            games (
              id,
              game_status,
              misses
            )
          `)

        if (error) throw error

        const playersWithStats: PlayerStats[] = (data || []).map((profile) => {
          const completedGames = (profile.games || []).filter((g: { game_status: string }) => g.game_status === "completed")
          const gamesPlayed = completedGames.length
          const bestRecord = completedGames.length > 0
            ? Math.min(...completedGames.map((g: { misses: number }) => g.misses))
            : null

          return {
            id: profile.id,
            username: profile.username,
            avatar_url: profile.avatar_url,
            games_played: gamesPlayed,
            best_record: bestRecord
          }
        })

        setPlayers(playersWithStats)
      } catch (err) {
        console.error("Error fetching players:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [supabase])

  return (
    <main className="min-h-screen p-4 pb-20">
      <div className="max-w-sm mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Users className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Jugadores</h1>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : players.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Users className="size-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No hay jugadores registrados aún</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {players.map((player) => (
              <Card key={player.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={player.avatar_url || undefined} alt={player.username} />
                      <AvatarFallback className="text-sm">
                        {player.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{player.username}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{player.games_played} partidas</span>
                        <span className="flex items-center gap-1 text-primary">
                          <Trophy className="size-3" />
                          {player.best_record !== null ? `${player.best_record} récord` : '-'}
                        </span>
                      </div>
                    </div>

                    <Link href={`/players/${player.id}`}>
                      <Button variant="outline" size="sm" className="shrink-0">
                        Ver perfil
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}