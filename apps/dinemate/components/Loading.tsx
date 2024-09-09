"use client"
import Image from "next/image"
import PuffLoader from "react-spinners/PuffLoader"
export default function Loading() {
  return (
    <div className="fixed top-0 left-0 bg-white z-50 w-screen h-screen flex items-center justify-center">
        <div className="relative w-fit h-fit">
          <PuffLoader size={"120px"} color="#FF680D" speedMultiplier={0.5} />
          <Image 
          src={"/logo.svg"} 
          alt="dinemate logo" 
          width={60} 
          height={60} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
          />
        </div>
    </div>
  )
}