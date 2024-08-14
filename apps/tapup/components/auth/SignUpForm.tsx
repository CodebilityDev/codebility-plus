'use client'

import { Button } from '@codevs/ui/button'
import React, { useState } from 'react'

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
import { signUp } from '@/app/auth/actions'
import Link from 'next/link'
import { Checkbox } from '@codevs/ui/checkbox'
import pathsConfig from '@/config/paths.config'
import { signInWithOAuth } from '@/app/auth/actions'

const formSchema = z.object({
  name: z.string(),
  email: z
    .string()
    .min(3, {
      message: 'Email is required',
    })
    .email({
      message: 'Please enter a valid email address',
    }),
  password: z.string().min(8, {
    message: 'Password must be at least 6 character(s) long',
  }),
  confirmPassword: z.string(),
  privacyPolicy: z.boolean().refine((value) => value === true, {
    message: 'You must acknowledge the privacy policy.',
  }),
})

function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSignUp = async (formData: FormData) => {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    await signUp(email, password, name)
  }
  return (
    <div className="flex w-full justify-center">
      <Form {...form}>
        <form
          noValidate
          action={handleSignUp}
          className="flex w-full max-w-xl flex-col gap-4 rounded-lg p-8 shadow-2xl"
        >
          <div className="flex flex-col gap-y-3">
            <h2 className="text-custom-black -mb-2 text-center font-bold md:text-start md:text-2xl">
              Create a Tap Up account
            </h2>
            <div className="flex gap-x-2">
              <p className="text-sm text-gray-400">Already have an acount?</p>
              <Link
                href={pathsConfig.auth.signIn}
                className="text-sm text-green-500"
              >
                Login
              </Link>
            </div>
            <div className="flex gap-x-2">
              <Button
                onClick={() => signInWithOAuth('google')}
                type="button"
                className="text-custom-black hover:text-custom-black flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-400 bg-white py-3 hover:bg-gray-50"
              >
                <div className="relative aspect-square w-5">
                  <Image src="/devicon_google.svg" alt="google" fill />
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => signInWithOAuth('facebook')}
                className="text-custom-black hover:text-custom-black flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-700 py-3 hover:bg-blue-500  "
              >
                <div className="relative aspect-square w-5">
                  <Image src="/facebook.svg" alt="facebook" fill />
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => signInWithOAuth('linkedin_oidc')}
                className="text-custom-black hover:text-custom-black flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-400 bg-white py-3 hover:bg-gray-50 "
              >
                <div className="relative aspect-square w-5">
                  <Image src="/linkedin.svg" alt="linkedin" fill />
                </div>
              </Button>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          {/* DIVIDER */}

          <Button
            type="submit"
            className="bg-custom-green hover:bg-custom-green/90 mt-6 w-full font-semibold text-white"
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
              'Create Account'
            )}
          </Button>

          <FormField
            control={form.control}
            name="privacyPolicy"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormLabel>
                    <p className="text-custom-black text-xs">
                      By agreeing, you agree TapUp{' '}
                      <Link className="text-custom-green text-xs" href="">
                        Terms and Services
                      </Link>{' '}
                      and{' '}
                      <Link className="text-custom-green text-xs" href="">
                        Privacy Policy
                      </Link>
                    </p>
                  </FormLabel>
                </div>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}

export default SignUpForm
