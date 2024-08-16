import React, { ReactNode } from "react"

interface H1 {
  children: ReactNode
  className?: string
}

const H1: React.FC<H1> = ({ children, className }) => {
  return <h1 className={`mb-4 text-2xl font-semibold uppercase text-white md:text-5xl ${className}`}>{children}</h1>
}

export default H1
