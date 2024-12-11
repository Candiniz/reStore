'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "../ui/form"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  email: z.string({
    required_error: "Insirá seu melhor email.",
  }).email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string({
    required_error: "Crie sua senha.",
  }).min(7, {
    message: "A senha deve ter pelo menos 7 caracteres"
  })
});

export default function LoginAccountForm() {

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const supabase = createClientComponentClient()
      const { email, password } = values
      const { error, data: { session } } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      form.reset()
      router.refresh()

    } catch(error) {
      console.log("LoginAccountForm:onSubmit", error)
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <span className="text-lg font-bold">Bem vindo novamente!</span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 pb-5"
        >
          {/* Campo E-mail */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="E-mail" {...field} />
                </FormControl>
                <FormDescription>Este é o seu E-mail</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder="Password" {...field} />
                </FormControl>
                <FormDescription>Esta é sua senha</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botão de Submit */}
          <Button className='' type="submit">Login</Button>
        </form>
      </Form>
    </div>
  );
}
