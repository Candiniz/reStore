import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

interface NextRequestWithImage extends NextRequest {
    imageUrl: string
}

export async function POST(req: NextRequestWithImage) {
    const { imageUrl } = await req.json()

    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session }, error } = await supabase.auth.getSession()

    if (!session || error) {
        return NextResponse.json(
            { message: "Faça login para poder restaurar uma imagem" },
            { status: 500 }
        );
    }

    const startRestoreProcess = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
        },
        body: JSON.stringify({
            version: "0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
            input: {
                img: imageUrl,
                version: "v1.4",
                scale: 2
            }
        }),
    })

    const jsonStartProcessResponse = await startRestoreProcess.json()
    const endpointUrl = jsonStartProcessResponse.urls.get

    let restoredImage: string | null = null

    while(!restoredImage){
        console.log("Pooling image from Replicate...")

        const finalResponse = await fetch(endpointUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
            },
        })

        const jsonFinalResponse = await finalResponse.json()

        if(jsonFinalResponse.status === "succeeded") {
            restoredImage = jsonFinalResponse.output;
        } else if(jsonFinalResponse.status === "failed") {
            break; // TODO: Gerar um erro para interface de usuário
        } else {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000)
            })
        }
    }

    console.log("Imagem sendo restaurada:", imageUrl);


    return NextResponse.json({data: restoredImage ? restoredImage : "Falha na restauração da imagem."}, {
        status: 200
    })
}