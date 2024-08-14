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
import { useRouter } from 'next/navigation'
import { signUp } from '@/app/auth/actions'
import Link from 'next/link'

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
    <div>
      <Form {...form}>
        <form className="flex w-full max-w-lg flex-col gap-4 rounded-lg p-8 shadow-2xl"></form>
      </Form>
    </div>
  )
}

export default SignUpForm
