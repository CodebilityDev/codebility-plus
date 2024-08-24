import React from 'react'
import SignInForm from '../_components/sign-in-form'
import Image from 'next/image'
import DineMateLogo from "~/public/DineMateLogo.png";

function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white w-screen ">
      <Image src={DineMateLogo} alt="DineMate" className="mb-4" />
      <div className="text-center mb-10">
        <h2 className="text-xl mt-1 font-light text-red">
          Welcome Admin! Enter your details here.
        </h2>
      </div>
      <SignInForm />
    </div>
  )
}

export default Login
