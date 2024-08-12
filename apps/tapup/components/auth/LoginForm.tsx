'use client'

import { signInWithOAuth, signInWithPassword } from '@/app/auth/actions'
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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

function LoginForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleLogin = async (formData: FormData) => {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      await signInWithPassword(email, password)
    } catch (e) {
      alert(e)
    }
  }

  return (
    <div className="flex w-8/12">
      <div className="flex-1 rounded-l-xl bg-slate-50">
        <div className="flex flex-col items-center gap-3 px-10 py-16">
          <Form {...form}>
            <Image
              src="/logo-tapup-dark.svg"
              width={150}
              height={150}
              alt="tapup-brand"
            />
            <div className="flex flex-col items-center gap-1">
              <div className="-mb-1 text-3xl font-bold">
                Create your free account
              </div>
              <div className="flex w-96 flex-col gap-1 text-sm">
                <div className="text-center">
                  Create your free account to search or filter through multiple
                  cards. No credit card required.
                </div>
                <div className="w-full">
                  <Button
                    variant={'outline'}
                    type="button"
                    onClick={async () => await signInWithOAuth('google')}
                    className="w-full"
                  >
                    {' '}
                    <Image
                      src="/google-icon.svg"
                      alt="googleIcon"
                      width={20}
                      height={20}
                    />{' '}
                    &nbsp;Continue with Google
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4">or</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>
            <form action={handleLogin} className="w-full">
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
                          className="peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-green-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-green-600"
                          placeholder=" "
                          {...field}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="email"
                        className="absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-green-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-green-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
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
                          className="peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-green-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-green-600"
                          placeholder=" "
                          {...field}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="password"
                        className="absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-green-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-green-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                      >
                        Password
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div
                onClick={() => router.push('/password_reset')}
                className="mt-1 flex cursor-pointer justify-end text-sm text-green-600 hover:text-gray-900"
              >
                Forgot Password?
              </div>
              <div className="mt-1 flex flex-col gap-2">
                <div className="space-x-2 text-center">
                  <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    By proceeding, you agreed to the&nbsp;
                    <span className="cursor-pointer font-semibold underline  hover:text-green-600">
                      Terms of services
                    </span>
                    &nbsp;and&nbsp;
                    <span className="cursor-pointer font-semibold underline hover:text-green-600">
                      Privacy policy
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 text-white"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="mr-3 h-5 w-5 animate-spin text-white"
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

                <div className="space-x-2 text-center">
                  <p>
                    Don’t have an account?&nbsp;
                    <span
                      onClick={() => router.push('/sign-up')}
                      className="cursor-pointer font-semibold hover:text-green-600"
                    >
                      Sign-up here
                    </span>
                  </p>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="relative flex-1">
        <Image
          fill
          src="/login-side-bg.png"
          className="absolute inset-0 h-full w-full rounded-r-xl bg-green-500 object-cover"
          alt="Background Image"
        />
      </div>
    </div>
  )
}

export default LoginForm
