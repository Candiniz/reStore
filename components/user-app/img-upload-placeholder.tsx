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
import { GetServerSideProps } from "next";


interface FilePreview {
    file: Blob
    preview: string
}

export default function ImageUploadPlaceHolder() {
    const router = useRouter()

    const [isMounted, setIsMounted] = useState(false)

    const [file, setFile] = useState<FilePreview | null>()
    const [fileToProcess, setFileToProcess] = useState<{ path: string } | null>(null)
    const [restoredFile, setRestoredFile] = useState<FilePreview | null>()

    const [totalProjects, setTotalProjects] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);



    const onDrop = useCallback(async (acceptFiles: File[]) => {
        try {
            const file = acceptFiles[0];

            // Verificar se o arquivo já foi carregado anteriormente
            const supabase = createClientComponentClient();

            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id;
            const filePath = `${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_PROCESSING}/${userId}/${file.name}`;

            // console.log(userId)
            // console.log(file.name)

            // Checando se o arquivo já existe no bucket de processamento
            const { data: existingFiles, error: listError } = await supabase.storage
                .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
                .list(`${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_PROCESSING}/${userId}`);

            if (listError) {
                console.error("Erro ao listar arquivos:", listError.message);
                alert("Erro ao verificar arquivos. Tente novamente.");
                return;
            }

            // Se o arquivo já existir, bloqueia o upload e mostra o alerta
            if (existingFiles.some(fileObj => fileObj.name === file.name)) {
                alert("Você já importou uma foto com o mesmo nome. Tente verificar ou renomear a foto.");
                return;  // Impede o upload do arquivo
            }

            // Se o arquivo não existe, permita o upload
            setFile({
                file,
                preview: URL.createObjectURL(file),
            });

            const { data, error } = await supabase.storage
                .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
                .upload(filePath, file);

            if (error) {
                console.error("Erro ao fazer upload de documento:", error.message);
                alert("Erro desconhecido ao fazer upload. Tente novamente.");
            } else {
                setFileToProcess(data);
                console.log("Upload de documento concluído com sucesso:", data);
            }
        } catch (error) {
            console.log("onDrop", error);
            alert("Erro ao fazer upload. Tente novamente.");
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
            // Verificar se existe um arquivo em processamento
            if (fileToProcess) {
                const supabase = createClientComponentClient()

                // Verifique se o arquivo foi restaurado com sucesso
                if (!restoredFile) {
                    // Só deleta o arquivo da pasta PROCESSING se o aprimoramento não foi bem-sucedido
                    const { error } = await supabase.storage
                        .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
                        .remove([fileToProcess.path])

                    if (error) {
                        console.error("Erro ao remover o arquivo do Supabase:", error.message)
                    } else {
                        console.log("Arquivo removido com sucesso.")
                    }
                }

                // Limpar os estados
                setFile(null)
                setRestoredFile(null)
                setFileToProcess(null)
                router.refresh()
            }
        }
    }

    const handleEnhance = async () => {
        try {
            const supabase = createClientComponentClient();

            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id;

            const { data: { publicUrl } } = await supabase.storage
                .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
                .getPublicUrl(`${fileToProcess?.path}`);

            console.log("fileToProcess:", fileToProcess);


            const res = await fetch("/api/ai/replicate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageUrl: publicUrl,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erro desconhecido ao aprimorar a imagem");
            }

            const restoredImageUrl = await res.json();
            // console.log(restoredImageUrl)
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
                .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
                .upload(`${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_RESTORED}/${userId}/${file?.file.name}`, imageBlob)

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

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch("/api/supabase/count"); // Chama sua API
                const data = await response.json();

                setTotalProjects(data.totalProjects); // Armazena o número de projetos
            } catch (err) {
                setError("Erro ao carregar projetos");
            } finally {
                setLoading(false); // Finaliza o carregamento
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return <p className="m-auto py-5 w-full text-center text-sm text-muted-foreground">Carregando...</p>; 
    }

    if (error) {
        return <p>{error}</p>;
    }

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

                <h3 className="mt-4 text-lg font-semibold">
                    {totalProjects > 0
                        ? "O que vamos aprimorar hoje?"
                        : "Adicione sua primeira foto!"
                    }
                </h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Selecione as fotos que serão aprimoradas!
                </p>
                <Dialog onOpenChange={handleDialogOpenChange}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="relative">
                            Traga suas memórias a vida
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {restoredFile
                                    ? "Processo Concluido!"
                                    : "Adicionar foto"
                                }
                            </DialogTitle>
                            <DialogDescription>
                                {restoredFile
                                    ? "Você pode ver a sua foto aprimorada no seu Dashboard! Veja a diferença entre a versão original e a aprimorada na sessão 'Antes/Depois'!"
                                    : "Arraste sua foto para fazer o Upload & Aprimoramento"
                                }
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
                                                    <p className="flex items-center justify-center bg-blue-100 opacity-70 text-opacity-50 border border-blue-300 border-dashed p-6 h-36 rounded-md">Arraste sua foto aqui</p>
                                                ) : (
                                                    <p className="flex items-center justify-center bg-blue-100 opacity-70 text-opacity-50 border border-blue-300 border-dashed p-6 h-36 rounded-md">Arraste ou clique para selecionar a imagem</p>
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
                            <Button
                                onClick={restoredFile ? handleDialogOpenChange.bind(null, false) : handleEnhance}>
                                {restoredFile ? "Fechar" : "Aprimorar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
