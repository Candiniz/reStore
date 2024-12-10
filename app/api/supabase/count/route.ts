import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";  // Para acessar os cookies da requisição

async function countProjects(userId: string) {
    const supabase = createServerComponentClient({
        cookies,  // Passa os cookies para o supabase
    });

    // A partir do userId que foi passado, você pode usar ele diretamente na consulta.
    // Contar arquivos na pasta de imagens restauradas
    const { data: imgRestoredData, error: imgRestoredError } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
        .list(`${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_RESTORED}/${userId}`);

    // Contar arquivos na pasta de documentos restaurados
    const { data: docRestoredData, error: docRestoredError } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER)
        .list(`${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER_RESTORED}/${userId}`);

    if (imgRestoredError || docRestoredError) {
        throw new Error("Erro ao listar arquivos.");
    }

    // Contar quantos arquivos (projetos) existem em ambas as pastas
    const imgRestoredCount = imgRestoredData.length;
    const docRestoredCount = docRestoredData.length;

    // Total de projetos
    const totalProjects = imgRestoredCount + docRestoredCount;

    // Quantos faltam para atingir a meta de 5
    const projectsRemaining = totalProjects >= 5 ? 0 : 5 - totalProjects;

    return {
        totalProjects,
        projectsRemaining,
    };
}

// Manipulador para a rota API
export async function GET() {
    try {
        const cookieStore = cookies(); // Pega os cookies
        const supabase = createServerComponentClient({
            cookies: () => cookieStore, // Passa os cookies para o supabase
        });

        // Obtem o usuário a partir da sessão
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            throw new Error("Usuário não autenticado.");
        }

        const userId = user.id;  // Acessa o userId diretamente

        // Passa o userId para a função que conta os projetos
        const projectData = await countProjects(userId);

        return new Response(JSON.stringify(projectData), { status: 200 });
    } catch (error) {
        return new Response('Erro ao buscar dados dos projetos', { status: 500 });
    }
}
