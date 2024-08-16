import React, { ReactNode } from "react"

interface CodevHeading {
  children: ReactNode
}

const CodevHeading: React.FC<CodevHeading> = ({ children }) => {
  return <p className="mb-4 text-lg text-teal">{children}</p>
}

export default CodevHeading
