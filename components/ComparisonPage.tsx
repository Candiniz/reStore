"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactCompareImage from "react-compare-image";

interface ComparisonPageProps {
  id: string; // Recebendo o ID como prop
}

export default function ComparisonPage({ id }: ComparisonPageProps) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);  // Acessa os parâmetros da URL
    const userIdFromUrl = urlParams.get("userId");  // Obtém o userId da URL

    if (userIdFromUrl) {
      setUserId(userIdFromUrl);  // Atualiza o estado com o userId obtido da URL
    }
  }, []);



  // URLs das imagens com base no userId e no id da imagem/documento
  const originalImage = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_PROCESSING}/${userId}/${id}`;

  const restoredImage = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_RESTORED}/${userId}/${id}`;





  console.log(restoredImage)
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  if (!userId) {
    return <div>Loading...</div>; // Exiba algo enquanto o userId está sendo carregado
  }

  return (
    <div className="relative h-screen w-full bg-black">
      <ReactCompareImage
        leftImage={originalImage}
        rightImage={restoredImage}
        leftImageStyle={{
          objectFit: "contain", // Garante que a imagem original será redimensionada sem cortar

        }}
        rightImageStyle={{
          objectFit: "contain", // Garante que a imagem restaurada será redimensionada sem cortar

        }}
      />
      {/* Botão de Voltar */}
      <button
        className="absolute top-4 left-4 px-4 py-2 bg-white text-black rounded-md z-10"
        onClick={() => router.back()}
      >
        Voltar
      </button>
    </div>
  );
}
