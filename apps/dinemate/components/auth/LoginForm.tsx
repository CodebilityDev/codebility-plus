"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@codevs/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@codevs/ui/form"
import { Input } from "@codevs/ui/input"
import { Checkbox } from "@codevs/ui/checkbox"
import Link from "next/link"

import { useRouter, useSearchParams } from "next/navigation"
import login from "~/lib/apiRequests/login"
import { useState } from "react"





const LoginForm = () => {
  const router = useRouter()
  const search = useSearchParams()
  const tableSessionId = search.get("tableSessionId")

  const formSchema = z.object({    
    fullname: z.string().min(1, "required"),
    email: z.string().email({ message: "Must be a valid email" }),
    policy: z.boolean()
  })
  const [isLoading, setIsLoading] = useState(false)


  const form = useForm<z.infer<(typeof formSchema)>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      policy: false,
    },
  })

  const onSubmit = async(values: z.infer<(typeof formSchema)>) => {
    try {
      setIsLoading(true)
      const res = await login(values, tableSessionId)
    if (res.status === 200) {      
      router.replace('/auth/success')
    }
    } catch (error) {
      console.error("login failed")
    } finally {
      setIsLoading(false)
      
    }
    
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField        
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem className={`space-y-4 `}>
              <FormLabel className="text-[#888888] text-xs">Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>

              <FormMessage className="!mt-2 mb-0 text-xs"/>

            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-4">

              <FormLabel className="text-[#888888] text-xs">Email</FormLabel>
              <FormControl>
                <Input placeholder="johndoe@example.com" {...field} />
              </FormControl>
              <FormMessage className="!mt-2 mb-0 text-xs"/>

            </FormItem>
          )}
        />

      
        <FormField
          control={form.control}
          name="policy"
          render={({ field }) => (

            <FormItem className={`space-y-0 rounded-md pt-2 pb-5 `}>
              <div className="flex items-center space-x-3 mb-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-[#CFCFD3]"
                  />
                </FormControl>
                <FormLabel className="text-xs text-[#888888]">
                  I have reviewed and agreed to the <Link href="/privacy-policy" className="underline text-xs ">privacy policy.</Link>
                </FormLabel>
              </div>
              <FormMessage className="text-xs"/>
            </FormItem>
          )}
        />
         
        <Button type="submit" className="w-full font-bold text-[16px] h-14 bg-[#FF680D] hover:bg-orange-600 disabled:opacity-50" disabled={isLoading}>
            Login  
        </Button>

      </form>
   
    </Form>
  )
}

export default LoginForm
