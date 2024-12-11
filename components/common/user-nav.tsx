'use client'
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserIcon } from "lucide-react"
import Link from "next/link"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav() {
    const [user, setUser] = useState<User | null>(null) // Inicializando como null
    const supabase = createClientComponentClient()
    const router = useRouter()

    // Função para pegar o usuário
    const getUser = async () => {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
            console.log("UserNav", error)
            return
        }
        setUser(user)
    }

    // Efeito para carregar o usuário ao montar o componente
    useEffect(() => {
        getUser()

        // Dependência vazia para executar somente uma vez no carregamento inicial
    }, [])

    // Função de logout
    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/'); // Garantir que o estado do usuário seja resetado após o logout

    }

    return (
        <>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8 rounded-full border-[1px] border-white">
                                <AvatarImage src="/avatars/male1.png" alt="Foto de Perfil" />
                                <AvatarFallback>RS</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {user.email?.split("@")[0]}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Link href={"/perfil"}>
                                <DropdownMenuItem className="cursor-pointer">
                                    Perfil
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                            Sair
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button variant="outline" onClick={() => router.push('/login')}>
                    Log In
                </Button>
            )}
        </>
    )
}
