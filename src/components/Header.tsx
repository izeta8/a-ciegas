"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { User, Users } from "lucide-react"

type Profile = {
  id: string
  username: string
  avatar_url: string | null
}

export function Header() {
  const { user, isLoading: authLoading, signInWithGoogle, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabaseRef = useRef(createClient())
  const userIdRef = useRef<string | null>(user?.id)

  useEffect(() => {
    userIdRef.current = user?.id ?? null
  }, [user?.id])

  useEffect(() => {
    const userId = userIdRef.current
    if (!userId) return

    const supabase = supabaseRef.current
    supabase
      .from("profiles")
      .select("id, avatar_url, username")
      .eq("id", userId)
      .single()
      .then(({ data }) => setProfile(data ?? null))
  }, [])

  const userInitials = profile?.username
    ? profile.username.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U"

  const displayName = profile?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuario"

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <span className="text-lg font-semibold">A Ciegas</span>
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white backdrop-blur">
      <div className="flex h-14 items-center px-4 z-50">
        <span className="text-lg font-semibold shrink-0">A Ciegas</span>

        <nav className="flex-1 flex justify-center gap-2">
          <Link href="/players">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Users className="size-4" />
              <span>Jugadores</span>
            </Button>
          </Link>
        </nav>

        <div className="shrink-0 bg-white">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="bg-white">
                <Button variant="ghost" className="flex items-center gap-2 h-auto py-1 px-2 rounded-full">
                  <span className="text-sm font-medium hidden sm:inline">{displayName}</span>
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={profile?.avatar_url || user.user_metadata?.avatar_url}
                      alt={displayName}
                    />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {displayName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="size-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={signInWithGoogle} size="sm">
              Iniciar sesión
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
