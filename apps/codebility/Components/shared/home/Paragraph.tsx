import React, { ReactNode } from "react"

interface Paragraph {
  children: ReactNode
  className?: string
}

const Paragraph: React.FC<Paragraph> = ({ children, className }) => {
  return <p className={`mb-3 text-sm text-secondaryColor ${className}`}>{children}</p>
}
export default Paragraph
