/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

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
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { isWeakMap } from "util/types"

interface FilePreview {
    file: Blob
    preview: string
}

export default function ImageUploadPlaceHolder() {

    const [file, setFile] = useState <FilePreview|null> ()
    const [fileToProcess, setFileToProcess] = useState <{path: string} | null>(null)
    const [restoredFile, setRestoredFile] = useState <FilePreview|null> ()

    const onDrop = useCallback(async (acceptFiles: File[]) => {
        try {
            const file = acceptFiles[0]
            setFile({
                file, preview: URL.createObjectURL(file)
            })
        } catch(error) {
            console.log("onDrop", error)
        }
    }, [])

    useEffect (() => {
        return () => {
            if(file) URL.revokeObjectURL(file.preview)
            if(restoredFile) URL.revokeObjectURL(restoredFile.preview)
        }
    }, [file])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            "image/png" : [".png"],
            "image/jpeg": [".jpg"],
        },
    })

    const handleDialogOpenChange = async (e:boolean) => {
        
    }

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

                <h3 className="mt-4 text-lg font-semibold">Adicione sua primeira foto!</h3>
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
                            <DialogTitle>Adicionar foto</DialogTitle>
                            <DialogDescription>
                               Arraste sua foto para fazer o Upload & Aprimoramento
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
                            <Button>Aprimorar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
