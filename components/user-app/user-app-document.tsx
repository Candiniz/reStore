/* eslint-disable prefer-const */
'use client'


import Image from "next/image"
import { PlusCircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { RestoredImage } from "@/types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
    image: RestoredImage
    aspectRatio?: "portrait" | "square"
    width?: number
    height?: number
    publicDocUrl: { publicUrl: string };
}

export default function UserAppDocument({
    image,
    aspectRatio = "portrait",
    width,
    height,
    publicDocUrl,
    className,
    ...props
}: AlbumArtworkProps) {


    const downloadImage = async (image: string) => {
        const supabase = createClientComponentClient()

        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        const { data } = await supabase.storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER)
            .download(`${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER_RESTORED}/${userId}/${image}`)

        if (data) {
            let a = document.createElement("a")
            document.body.appendChild(a)
            let url = window.URL.createObjectURL(data)
            a.href = url
            a.download = image
            a.click()
            window.URL.revokeObjectURL(url)
        }
    }

    return (
        <div className={cn("space-y-3", className)} {...props}>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="overflow-hidden rounded-md">
                        <Image
                            src={`${publicDocUrl.publicUrl}/${encodeURIComponent(image.name)}`}
                            alt={image.name}
                            width={width}
                            height={height}
                            className={cn(
                                "h-auto w-auto object-cover transition-all hover:scale-105",
                                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                            )}
                        />
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-40">
                    <ContextMenuItem>Adicionar à Coleção</ContextMenuItem>
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-48">
                            <ContextMenuItem>
                                <PlusCircleIcon className="mr-2 h-4 w-4" />
                                New Playlist
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            {/* {playlists.map((playlist) => (
                <ContextMenuItem key={playlist}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3" />
                  </svg>
                  {playlist}
                </ContextMenuItem>
              ))} */}
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSeparator />
                    <ContextMenuItem>Deletar</ContextMenuItem>
                    <ContextMenuItem>Duplicar</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={() => {
                        downloadImage(image.name)
                    }}>Download</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>Like</ContextMenuItem>
                    <ContextMenuItem>Compartilhar</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <div className="space-y-1 text-sm">
                <h3 className="font-medium leading-none">{image.name}</h3>
            </div>
        </div>
    )
}