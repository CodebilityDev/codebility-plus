import React, { ReactNode } from "react"

interface ButtonLink {
  children: ReactNode
}

const ButtonLink: React.FC<ButtonLink> = ({ children }) => {
  return <div className="mt-4 duration-300 hover:translate-x-2">{children}</div>
}

export default ButtonLink
