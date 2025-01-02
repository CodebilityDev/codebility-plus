import LoginForm from '~/components/auth/LoginForm'
import Image from 'next/image'
import React from 'react'

const LoginPage = () => {
  return (
    <>
      <h1 className='font-bold text-2xl leading-9 text-center'>Welcome to</h1>
      <div className="flex justify-center items-center gap-3">
        <Image src="/logo.png" alt="logo" width={56} height={56}/>
        <h1 className='font-bold text-[32px] text-orange-600'>DINEMATE!</h1>
      </div>
      <p className='mt-9 mb-5 text-[16px] text-[#888888]'>Enter your details</p>
      <LoginForm/>
    </>
  )
}

export default LoginPage