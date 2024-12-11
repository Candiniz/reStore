import { UserNav } from '@/components/common/user-nav';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploadPlaceHolder from '@/components/user-app/img-upload-placeholder';
import UserAppHeader from '@/components/user-app/user-app-header';
import { Sidebar } from '@/components/user-app/user-app-sidebar';
import UserAppImage from '@/components/user-app/user-app-image'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { PlusCircle } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import DocumentUploadPlaceHolder from '@/components/user-app/doc-upload-placeholder';
import UserAppDocument from '@/components/user-app/user-app-document';
import ProjectsDone from '@/components/user-app/ProjectsDone'
import { SidebarProvider } from '@/contexts/SidebarContext';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UserApp() {
  let loggedIn = false;

  // Cria o cliente do Supabase com os cookies
  const supabase = createServerComponentClient({
    cookies,
  });

  try {
    // Obtém a sessão e o usuário
    const { data: { user } } = await supabase.auth.getUser();
    const { data: { session } } = await supabase.auth.getSession();

    if (session && user) {
      loggedIn = true;
    }

    // Se o usuário não estiver logado, redireciona
    if (!loggedIn) {
      redirect("/", RedirectType.replace);
    }

    const userId = user?.id;
    // console.log('userID: ', userId)

    // Define os caminhos para as imagens e documentos restaurados
    const restoredImagesPath = `${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_RESTORED}/${userId}`;
    const restoredDocsPath = `${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER_RESTORED}/${userId}`;

    // Busca os arquivos restaurados
    const { data: restoredImages } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
      .list(restoredImagesPath, {
        limit: 10,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    const { data: restoredDocuments } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER)
      .list(restoredDocsPath, {
        limit: 10,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    // Filtra as imagens e documentos para remover itens com o nome ".emptyplaceholder"
    const filteredRestoredImages = restoredImages?.filter(
      (image) => image.name !== ".emptyplaceholder"
    );

    const filteredRestoredDocuments = restoredDocuments?.filter(
      (document) => document.name !== ".emptyplaceholder"
    );

    // Obtém a URL pública dos arquivos
    const { data: publicImgUrl } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
      .getPublicUrl(`${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_RESTORED}/${userId}`);

    const { data: publicDocUrl } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER)
      .getPublicUrl(`${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER_RESTORED}/${userId}`);

    // console.log('Doc URL:', publicDocUrl);
    // console.log('Img URL:', publicImgUrl);

    return (
      <>
        <div className="lg:flex">
          <SidebarProvider>
            <UserAppHeader />
            <Sidebar />
          </SidebarProvider>
          <div className="text-[#052539] px-10 lg:px-2 lg:mt-[50px] lg:ml-64">
            <div className="">
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="fotos" className="h-full space-y-6">
                    <div className="space-between flex items-center w-full justify-center">
                      <TabsList>
                        <TabsTrigger value="fotos" className="relative">
                          Fotos
                        </TabsTrigger>
                        <TabsTrigger value="documentos">Documentos</TabsTrigger>
                        <TabsTrigger value="outros" className="relative">
                          Outros
                        </TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4 flex">
                        <Link href='/perfil'>
                          <Button>
                            <PlusCircle />
                            Ver Perfil
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <TabsContent
                      value="fotos"
                      className="border-none p-0 outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Coleções de Fotos
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Fotos já aprimoradas:
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <ImageUploadPlaceHolder />
                        <Separator className="my-4" />
                        <h3 className='py-5 w-full text-center'>
                          Clique em uma imagem para comparar o resultado com a original!
                        </h3>
                        <ScrollArea>
                          <div
                            className="flex items-center justify-center flex-wrap gap-2
                          ">
                            {filteredRestoredImages?.map((restoredImage) => (
                              <Link
                                key={restoredImage.name}
                                href={`/${restoredImage.name}?userId=${userId}`}
                              >
                                <UserAppImage
                                  image={restoredImage}
                                  className="w-[250px] cursor-pointer"
                                  aspectRatio="square"
                                  width={250}
                                  height={330}
                                  publicImgUrl={publicImgUrl}
                                />
                              </Link>
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                      <div className="mt-6 space-y-1">

                      </div>
                      <Separator className="my-4" />
                    </TabsContent>
                    <TabsContent
                      value="documentos"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Coleções de Documentos
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Documentos já aprimorados:
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className='relative'>
                        <DocumentUploadPlaceHolder />
                        <ScrollArea>
                          <div
                            className="flex items-center justify-center flex-wrap gap-2
                          ">
                            {filteredRestoredDocuments?.map((restoredDocument) => (
                              <UserAppDocument
                                key={restoredDocument.name}
                                image={restoredDocument}
                                className="w-[250px]"
                                aspectRatio="square"
                                width={250}
                                height={330}
                                publicDocUrl={publicDocUrl}
                              />
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="outros"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Outros:
                          </h2>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className='relative'>

                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.log("UserApp Error:", error);
    return <div>Erro ao carregar os dados do usuário.</div>;
  }
}