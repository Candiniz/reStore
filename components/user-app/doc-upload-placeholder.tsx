/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import { POST } from "@/app/api/ai/replicate/route"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"


interface FilePreview {
    file: Blob
    preview: string
}

export default function DocumentUploadPlaceHolder() {
    const router = useRouter()

    const [isMounted, setIsMounted] = useState(false)

    const [file, setFile] = useState<FilePreview | null>()
    const [fileToProcess, setFileToProcess] = useState<{ path: string } | null>(null)
    const [restoredFile, setRestoredFile] = useState<FilePreview | null>()

    const onDrop = useCallback(async (acceptFiles: File[]) => {
        try {
            const file = acceptFiles[0];
            setFile({
                file, preview: URL.createObjectURL(file)
            });

            const supabase = createClientComponentClient();

            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id;

            const { data, error } = await supabase.storage
                .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER)
                .upload(
                    `${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER_PROCESSING}/${userId}/${acceptFiles[0].name}`, acceptFiles[0]
                )

            if (!error) {
                setFileToProcess(data)
            }

            if (error) {
                console.error("Erro ao fazer upload de documento:", error);
            } else {
                console.log("Upload de documento concluído com sucesso:", data);
            }
        } catch (error) {
            console.error("Erro no onDrop para documentos:", error);
        }
    }, []);




    useEffect(() => {
        setIsMounted(true)
        return () => {
            if (file) URL.revokeObjectURL(file.preview)
            if (restoredFile) URL.revokeObjectURL(restoredFile.preview)
        }
    }, [file])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg"],
        },
    })

    const handleDialogOpenChange = async (e: boolean) => {
        if (!e) {
            if (fileToProcess) {
                const supabase = createClientComponentClient()
                const { error } = await supabase.storage
                    .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER)
                    .remove([fileToProcess.path])
                setFile(null)
                setRestoredFile(null)
                router.refresh()

                console.log("Tentando remover o arquivo:", fileToProcess.path);

                if (error) {
                    console.error("Erro ao remover o arquivo do Supabase:", error.message)
                } else {
                    console.log("Arquivo removido com sucesso.")
                }
            }
             // Limpar os estados
            setFileToProcess(null)
            router.refresh()
        }
    }

    const handleEnhance = async () => {
        try {
            const supabase = createClientComponentClient();

            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id;
            // console.log('userId:', userId)

            const { data: { publicUrl } } = await supabase.storage
                .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER)
                .getPublicUrl(`${fileToProcess?.path}`);

            const res = await fetch("/api/ai/replicatedocs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    documentUrl: publicUrl,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erro desconhecido ao aprimorar a imagem");
            }

            const restoredImageUrl = await res.json();
            const readImageRes = await fetch(restoredImageUrl.data);

            if (!readImageRes.ok) {
                throw new Error("Erro ao baixar a imagem aprimorada.");
            }

            const imageBlob = await readImageRes.blob();
            setRestoredFile({
                file: imageBlob,
                preview: URL.createObjectURL(imageBlob),
            });

            const { data, error } = await supabase.storage
                .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER)
                .upload(`${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER_RESTORED}/${userId}/${file?.file.name}`, imageBlob)
                

            if (error) {
                setRestoredFile(null)
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("handleEnhance:", error.message);
                alert(error.message);
                setFile(null)
                setRestoredFile(null)
            } else {
                console.error("handleEnhance: erro inesperado", error);
                alert("Ocorreu um erro inesperado.");
            }
        }
    };


    if (!isMounted) return null

    return (
        <div className="flex h-[200px] w-full shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-10 w-10 text-muted-foreground"
                    viewBox="0 0 24 24"
                >
                    <circle cx="12" cy="11" r="1" />
                    <path d="M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5ZM8 14a5 5 0 1 1 8 0" />
                    <path d="M17 18.5a9 9 0 1 0-10 0" />
                </svg>

                <h3 className="mt-4 text-lg font-semibold">Adicione seu primeiro documento!</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Selecione os documentos que serão aprimoradas!
                </p>
                <Dialog onOpenChange={handleDialogOpenChange}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="relative">
                            Recupere dados importantes!
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar documento</DialogTitle>
                            <DialogDescription>
                                Arraste seu documento para fazer o Upload & Aprimoramento
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                {
                                    !file && (
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            {
                                                isDragActive ? (
                                                    <p className="flex items-center justify-center bg-blue-100 opacity-70 text-opacity-50 border border-blue-300 border-dashed p-6 h-36 rounded-md">Arraste seu documento aqui</p>
                                                ) : (
                                                    <p className="flex items-center justify-center bg-blue-100 opacity-70 text-opacity-50 border border-blue-300 border-dashed p-6 h-36 rounded-md">Arraste ou clique para selecionar o documento</p>
                                                )
                                            }
                                        </div>
                                    )
                                }
                                <div className="flex flex-col items-center justify-evenly sm:flex-row gap-2">
                                    {
                                        file && (
                                            <div className="flex flex-row flex-wrap drop-shadow-md">
                                                <div className="flex w-48 h-48 relative">
                                                    <img
                                                        src={file.preview}
                                                        className="w-48 h-48 object-contain rounded-md"
                                                        onLoad={() => URL.revokeObjectURL(file.preview)}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        restoredFile && (
                                            <div className="flex flex-row flex-wrap drop-shadow-md">
                                                <div className="flex w-60 h-60 relative">
                                                    <img
                                                        src={restoredFile.preview}
                                                        className="w-60 h-60 object-contain rounded-md"
                                                        onLoad={() => URL.revokeObjectURL(restoredFile.preview)}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleEnhance}>Aprimorar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
