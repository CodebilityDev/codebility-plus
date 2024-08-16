import React, { ReactNode } from "react"

interface TextGradient {
  children: ReactNode
}

const TextGradient: React.FC<TextGradient> = ({ children }) => {
  return <span className="bg-gradient-to-t from-cyan-400 to-purple-700 bg-clip-text text-transparent">{children}</span>
}

export default TextGradient
