import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { createClient } from '@/utils/supabase/server'


import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import CreateAccountForm from '@/components/auth/CreateAccountForm';
import LoginAccountForm from '@/components/auth/LoginAccountForm';
import Image from 'next/image';



export default async function Home() {
  let loggedIn = false

  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (session) loggedIn = true

  } catch (error) {
    console.log("Home", error)
  } finally {
    if (loggedIn) redirect("/user-app", RedirectType.replace)
  }


  return (
    <div 
    className="flex flex-col-reverse lg:flex-row-reverse h-screen w-full 
    justify-center gap-10 lg:gap-0 lg:justify-between items-center
    bg-[url('/background-home2.jpg')] bg-cover bg-center bg-opacity-60 lg:px-10"
    >
      <Tabs defaultValue="create-account" className="w-[85%] sm:w-[70%] md:w-[400px] rounded-2xl bg-white mb-5 lg:mb-0 lg:mr-5">

        <TabsList className="flex justify-around items-center rounded-2xl rounded-b-none h-14 bg-gray-800">
          <TabsTrigger
            value="login"
            className='transition-all delay-150'>
            Login
          </TabsTrigger>
          <TabsTrigger
            value="create-account"
            className='transition-all delay-150'>
            Criar uma conta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginAccountForm />
        </TabsContent>
        <TabsContent value="create-account">
          <CreateAccountForm />
        </TabsContent>

      </Tabs>
      <div className='mt-10 lg:mt-0 w-[300px] lg:w-fit'>
        <Image alt='Logo' src='/logo.png' width={500} height={125} 
        className='max-w-[]'
        />
      </div>
    </div>
  );
}
