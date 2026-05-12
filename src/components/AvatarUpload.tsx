"use client"

import Image from "next/image"
import { useState, useRef, useCallback } from "react"
import ReactCrop, { Crop, PixelCrop } from "react-image-crop"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, X } from "lucide-react"
import "react-image-crop/dist/ReactCrop.css"

interface AvatarUploadProps {
  currentAvatarUrl: string
  onAvatarUpdate: (url: string) => void
  username: string
}

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
  const canvas = document.createElement("canvas")
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  canvas.width = crop.width * scaleX
  canvas.height = crop.height * scaleY
  const ctx = canvas.getContext("2d")

  if (!ctx) throw new Error("No 2d context")

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return canvas.toDataURL("image/jpeg", 0.9)
}

export function AvatarUpload({ currentAvatarUrl, onAvatarUpdate, username }: AvatarUploadProps) {
  const { user } = useAuth()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || "US"

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecciona una imagen")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen debe ser menor a 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
      setCroppedImage(null)
      setError(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const size = Math.min(width, height)
    const x = (width - size) / 2
    const y = (height - size) / 2
    setCrop({ unit: "px", x, y, width: size, height: size })
    setImageRef(e.currentTarget)
  }, [])

  const handleCropConfirm = useCallback(async () => {
    if (!imageRef || !completedCrop) return

    try {
      const croppedUrl = getCroppedImg(imageRef, completedCrop)
      setCroppedImage(croppedUrl)
      setPreview(null)
    } catch {
      setError("Error al recortar la imagen")
    }
  }, [imageRef, completedCrop])

  const handleUpload = useCallback(async () => {
    if (!croppedImage || !user) return

    setUploading(true)
    setError(null)

    try {
      const base64 = croppedImage.split(",")[1]
      const binary = atob(base64)
      const array = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i)
      }
      const blob = new Blob([array], { type: "image/jpeg" })
      const filename = `${user.id}/${Date.now()}.jpg`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filename, blob, { contentType: "image/jpeg", upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filename)

      const publicUrl = urlData.publicUrl
      onAvatarUpdate(publicUrl)

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id)

      if (updateError) {
        console.error("Error updating profile:", updateError)
        throw updateError
      }

      setCroppedImage(null)
    } catch (err) {
      console.error("Upload error:", err)
      setError("Error al subir la imagen")
    } finally {
      setUploading(false)
    }
  }, [croppedImage, user, supabase, onAvatarUpdate])

  const handleCancel = useCallback(() => {
    setPreview(null)
    setCroppedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setError(null)
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={croppedImage || currentAvatarUrl} alt={username} />
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="avatar-input"
      />

      {!preview && !croppedImage && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="size-4 mr-2" />
          Cambiar foto
        </Button>
      )}

      {preview && (
        <div className="w-full max-w-xs space-y-4">
          <div className="relative bg-muted rounded-lg overflow-hidden">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={setCompletedCrop}
              aspect={1}
              circularCrop
            >
              <Image
                src={preview}
                alt="Preview"
                onLoad={onImageLoad}
                className="max-h-64 mx-auto"
                width={256}
                height={256}
              />
            </ReactCrop>
          </div>
          <div className="flex gap-2 justify-center">
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="size-4 mr-1" />
              Cancelar
            </Button>
            <Button size="sm" onClick={handleCropConfirm} disabled={!completedCrop}>
              <Upload className="size-4 mr-1" />
              Recortar
            </Button>
          </div>
        </div>
      )}

      {croppedImage && (
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="size-4 mr-1" />
            Cancelar
          </Button>
          <Button size="sm" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Subiendo..." : "Guardar foto"}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
