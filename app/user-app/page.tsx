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
import MiscUploadPlaceHolder from '@/components/user-app/misc-upload-placeholder';
import UserAppOther from '@/components/user-app/user-app-other';


export default async function UserApp() {

  let loggedIn = false
  const supabase = createServerComponentClient({ cookies })

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      loggedIn = true;


    }
  } catch (error) {
    console.log("UserApp", error)
  } finally {
    if (!loggedIn) redirect("/", RedirectType.replace)
  }

  const { data: restoredImages } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
    .list(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_RESTORED, {
      limit: 10,
      offset: 0,
      sortBy: { column: "name", order: "asc" }
    })

  const { data: restoredDocuments } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER)
    .list(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER_RESTORED, {
      limit: 10,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  // const { data: restoredOthers } = await supabase.storage
  // .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_MISC_FOLDER)
  // .list(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_MISC_FOLDER_RESTORED, {
  //     limit: 10,
  //     offset: 0,
  //     sortBy: { column: "name", order: "asc" },
  // });



  const { data: publicImgUrl } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
    .getPublicUrl(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_RESTORED)

  const { data: publicDocUrl } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER)
    .getPublicUrl(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_DOCUMENT_FOLDER_RESTORED)

    // console.log('Doc:', publicDocUrl)
    // console.log('Img:', publicImgUrl)

  return (
    <>
      <div className="">
        <UserAppHeader />
        <div className="text-[#052539] mt-[50px]">
          <div className="">
            <div className="grid lg:grid-cols-5">
              <Sidebar className='hidden lg:block' />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="fotos" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="fotos" className="relative">
                          Fotos
                        </TabsTrigger>
                        <TabsTrigger value="documentos">Documentos</TabsTrigger>
                        <TabsTrigger value="outros" className="relative">
                          Outros
                        </TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4">
                        <Button>
                          <PlusCircle />
                          Adicionar Conjunto
                        </Button>
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
                        <ScrollArea>
                          <div
                            className="flex items-center justify-center flex-wrap gap-2
                          ">
                            {restoredImages?.map((restoredImage) => (
                              <UserAppImage
                                key={restoredImage.name}
                                image={restoredImage}
                                className="w-[250px]"
                                aspectRatio="square"
                                width={250}
                                height={330}
                                publicImgUrl={publicImgUrl}
                              />
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
                            {restoredDocuments?.map((restoredDocument) => (
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
                        {/* <MiscUploadPlaceHolder />
                        <ScrollArea>
                          <div
                            className="flex items-center justify-center flex-wrap gap-2
                          ">
                            {restoredOthers?.map((restoredOther) => (
                              <UserAppOther
                                key={restoredOther.name}
                                image={restoredOther}
                                className="w-[250px]"
                                aspectRatio="square"
                                width={250}
                                height={330}
                                publicUrl={publicUrl}
                              />
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea> */}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}