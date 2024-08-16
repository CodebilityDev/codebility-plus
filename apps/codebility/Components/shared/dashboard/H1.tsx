import React, { ReactNode } from "react"

interface H1 {
  children: ReactNode
  className?: string
}

const H1: React.FC<H1> = ({ children, className }) => {
  return <h1 className={`text-dark100_light900 mb-4 text-lg font-semibold md:text-3xl ${className}`}>{children}</h1>
}

export default H1
