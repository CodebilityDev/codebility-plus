import React, { ReactNode } from "react"

interface Heading3 {
  children: ReactNode
}

const Heading3: React.FC<Heading3> = ({ children }) => {
  return <h3 className="mb-3 text-2xl font-semibold text-primaryColor">{children}</h3>
}

export default Heading3
