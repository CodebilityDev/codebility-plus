"use client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@codevs/ui/form'
import { Input } from '@codevs/ui/input'
import { Button } from '@codevs/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter, useSearchParams } from 'next/navigation'
import verifyAuthCode from '~/lib/verifyAuthCode'
import { useEffect, useState } from 'react'
import Loading from '../Loading'
import { deleteLink, getLink } from '~/lib/localStorage/table'

const formSchema = z.object({
  authCode: z.string().min(5, 'Must contain 5 characters').max(5, 'Cannot exceed 5 characters'),
})

const Authenticate = () => {
  const router = useRouter()
  const search = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const table = search.get('table')


  useEffect(() => {
    if(!table || table === 'null') {
      router.push('/auth/qr-scanner')
    }
  },[table, router])

  useEffect(() => {
    const link = getLink('link')
    if(link) {
      deleteLink('link')
      window.location.reload()
    }
  },[])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authCode: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    verifyAuthCode(values.authCode, table!)
    .then((res) => {
      if(res.status === 200) {
        router.replace('/auth/login')
      }else{
        setError(res.message)
        setIsLoading(false)
      }
    })
    .catch((err) => {
      setError('Server Error')
      setIsLoading(false)
    })
  }


  return (
    <div className='mt-20 relative'>
      <h1 className='text-center text-2xl font-bold'>Verification Code</h1>
      <p className='text-center text-sm my-5 text-custom-gray'>Type your 8 character authentication code</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            control={form.control}
            name="authCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="r7YusDf3" {...field} 
                    onChangeCapture={(e) => setError(null)}
                    className='h-12'
                  />
                </FormControl>
                <FormMessage className='text-xs absolute'/>
                {error && <p className='text-red-500 absolute text-xs font-semibold'>{error}</p>}
              </FormItem>
            )}
          />

          <Button type="submit"
          disabled={isLoading}
          variant={'default'}
          className='w-full h-14'>Submit</Button>
        </form>
      </Form>
      <div className={`${isLoading ? 'block' : 'hidden'} absolute  bg-white w-full bg-opacity-20`}>
        <Loading />
      </div>
    </div>
  )
}

export default Authenticate