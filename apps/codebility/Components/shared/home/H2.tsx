import React, { ReactNode } from "react"

interface H2 {
  children: ReactNode
  className?: string
}

const H2: React.FC<H2> = ({ children, className }) => {
  return <h2 className={`mb-4 text-2xl font-semibold uppercase md:text-5xl ${className}`}>{children}</h2>
}

export default H2
