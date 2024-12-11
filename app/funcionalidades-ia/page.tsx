import Link from "next/link";
import React from "react";

export default function AIPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-1xl md:text-2xl font-bold mb-6">Funcionalidades da IA</h1>

            <section className="mb-8">
                <h2 className="text-md md:text-lg font-semibold mb-2">Sobre as Tecnologias de IA Utilizadas</h2>
                <p className="text-sm md:text-md text-muted-foreground">
                    Nossa aplicação utiliza o poderoso modelo **GFPGAN**, desenvolvido pela **Tencent ARC**,
                    para restauração de imagens e aprimoramento de rostos em fotos antigas ou degradadas.
                    Essa IA foi projetada para preservar detalhes realistas enquanto melhora a nitidez e
                    qualidade visual, garantindo resultados impressionantes e naturais.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-md md:text-lg font-semibold mb-2">Principais Modelos no Replicate</h2>
                <p className="text-sm md:text-md text-muted-foreground">
                    No **Replicate**, exploramos uma variedade de modelos de IA avançados. Exemplos notáveis incluem o
                    **Stable Diffusion**, para geração de imagens altamente criativas, e o **Whisper**, da OpenAI, que realiza
                    transcrição e tradução de áudio com notável precisão. Essas ferramentas expandem as possibilidades de uso
                    da IA para diversas aplicações do cotidiano.
                </p>
            </section>

            <section>
                <h2 className="text-md md:text-lg font-semibold mb-2">Como Funciona o Processo no Nosso App</h2>
                <p className="text-sm md:text-md text-muted-foreground">
                    Nosso fluxo é simples e eficiente. O usuário envia uma imagem ou documento que precisa ser restaurado ou aprimorado.
                    Nossa aplicação utiliza tecnologias como o GFPGAN para processar o material enviado. Após o processamento, o arquivo
                    restaurado fica disponível para download, com uma interface intuitiva que permite fácil acesso e gerenciamento dos seus projetos.
                </p>
            </section>
            <Link href="/" className="text-sm text-blue-500 hover:underline">
                Voltar para a página inicial
            </Link>
        </div>
    );
}
