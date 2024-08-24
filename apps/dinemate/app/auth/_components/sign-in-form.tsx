'use client'

import { signInWithOAuth, signInWithPassword } from '../actions'
import { Button } from '@codevs/ui/button'
import React from 'react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@codevs/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import pathsConfig from '~/config/paths.config'
import { toast, Toaster } from '@codevs/ui/sonner-toast'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

function SignInForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSignIn = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values
    console.log(email, password);
    
    try {
      await signInWithPassword(email, password)
    } catch (e) {
      toast.error((e as { message: string }).message)
    }
  }

  return (
    <div className="flex w-8/12">
      <div className="bg-card flex-1 rounded-l-xl shadow-xl">
        <div className="flex flex-col items-center gap-3 px-10 py-16">
          <Toaster richColors position="top-right" />
          <Form {...form}>
           
            <form onSubmit={form.handleSubmit(handleSignIn)} className="w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <FormControl>
                        <input
                          type="email"
                          id="email"
                          className=" focus:border-primary dark:text-background dark:focus:border-primary border-border text-foreground peer block w-full appearance-none rounded-t-lg border-0 border-b-2 px-2.5 pb-2.5 pt-5 text-sm focus:outline-none focus:ring-0 dark:border-gray-600"
                          placeholder=" "
                          {...field}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="email"
                        className="text-primary peer-focus:text-primary dark:text-primary absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
                      >
                        Enter your Email
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <FormControl>
                        <input
                          type="password"
                          id="password"
                          className="focus:border-primary dark:focus:border-primary dark:text-background border-border text-foreground peer block w-full appearance-none rounded-t-lg border-0 border-b-2 px-2.5 pb-2.5 pt-5 text-sm focus:outline-none focus:ring-0 dark:border-gray-600"
                          placeholder=" "
                          {...field}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="password"
                        className="text-primary peer-focus:text-primary dark:text-primary absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
                      >
                        Password
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div
                onClick={() => router.push(pathsConfig.auth.passwordReset)}
                className="text-primary hover:text-foreground mt-1 flex cursor-pointer justify-end text-sm"
              >
                Forgot Password?
              </div>
              <div className="mt-1 flex flex-col gap-2">

                <Button
                  type="submit"
                  className="bg-primary w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="mr-3 h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </div>
                  ) : (
                    'Continue'
                  )}
                </Button>

              </div>
            </form>
          </Form>
        </div>
      </div>
      
    </div>
  )
}

export default SignInForm
