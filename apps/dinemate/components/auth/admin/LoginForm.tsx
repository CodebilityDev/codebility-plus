"use client";
import React, { useState } from "react";
import Link from "next/link";
import { adminService } from "@/modules";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";


const LoginForm: React.FC = () => {
  const router = useRouter()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {toast} = useToast()

  const handleLogin = async  (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
    const result = await adminService.adminLogin({email:username, password})
    if (!result){
      toast({
        variant: "destructive",
        title: "Username or Password is incorrect"
      })
    } else {      
      router.replace("/dashboard")
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />

        <Link
          href={"/admin/forgotpassword"}
          className="text-sm text-gray-00 hover:underline float-right mt-1"
        >
          Forgot Password?
        </Link>
      </div>
      <button
        type="submit"
        className="w-full mt-6 py-2 px-4 bg-[#FF670E]  text-white font-semibold rounded-md shadow hover:text-black"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
