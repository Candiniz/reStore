import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

async function countProjects() {
    const supabase = createClientComponentClient();

    
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;


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

    console.log("imgRestoredData:", imgRestoredData);
    console.log("docRestoredData:", docRestoredData);
    return {
        totalProjects,
        projectsRemaining,
    };
}

// Manipulador para a rota API
export async function GET() {
    try {
        const projectData = await countProjects();
        return new Response(JSON.stringify(projectData), { status: 200 });
    } catch (error) {
        return new Response('Erro ao buscar dados dos projetos', { status: 500 });
    }
}
