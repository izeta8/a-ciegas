"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AvatarUpload } from "@/components/AvatarUpload"

type Profile = {
  id: string
  username: string
  avatar_url: string | null
  created_at: string
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [username, setUsername] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    if (authLoading) return
    if (!user) return

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
        setError("Error al cargar el perfil")
      } else {
        setProfile(data)
        setUsername(data.username || "")
        setAvatarUrl(data.avatar_url || "")
      }
      setLoading(false)
    }

    fetchProfile()
  }, [user, authLoading, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!username.trim()) {
      setError("El nombre de usuario es obligatorio")
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase
      .from("profiles")
      .update({
        username: username.trim(),
        avatar_url: avatarUrl.trim() || null,
      })
      .eq("id", user.id)

    if (error) {
      setError("Error al guardar los cambios")
      console.error("Error updating profile:", error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Debes iniciar sesión para ver tu perfil.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Mi Perfil</CardTitle>
            <CardDescription>
              Actualiza tu información personal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AvatarUpload
                currentAvatarUrl={avatarUrl}
                onAvatarUpdate={setAvatarUrl}
                username={username}
              />

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Nombre de usuario
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Tu nombre"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={user.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  El email no se puede cambiar
                </p>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              {success && (
                <p className="text-sm text-green-600">
                  Cambios guardados correctamente
                </p>
              )}

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>

              <Link href="/" className="block">
                <Button variant="outline" className="w-full mt-2">
                  Volver al inicio
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
