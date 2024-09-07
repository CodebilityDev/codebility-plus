"use client"

import axios from "axios"
import { Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@codevs/ui/button"

export default function CodeGenerator() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading]  = useState(false)  

  const handleGenerateCode = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/codes/generate-single`)
      const c = res.data.code;
      setCode(c)
    } catch (error) {
      console.error("failed to generate single code", error) 
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);      
    } catch (error) {
      console.error('Failed to copy text to clipboard:', error);      
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-4 pe-4">
      <Button onClick={handleGenerateCode} disabled={isLoading}>Generate Code</Button>
      <div className="flex flex-row items-center gap-x-2 justify-between w-full h-[40px]">
        <div className="w-full flex-grow bg-gray-200 h-[40px] p-2 font-semibold rounded-md shadow-sm">
          <p>{code}</p>
        </div>
        <div className="h-[40px] flex justify-center items-center">
          <Copy onClick={copyToClipboard} size={24} className="drop-shadow cursor-pointer hover:scale-105 active:scale-95 transition-all duration-150" role="button" tabIndex={0}  />
        </div>
      </div>
    </div>
  )
}