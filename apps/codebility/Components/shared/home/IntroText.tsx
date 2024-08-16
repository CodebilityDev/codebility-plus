import React, { ReactNode } from "react"

interface IntroText {
  children: ReactNode
}

const IntroText: React.FC<IntroText> = ({ children }) => {
  return <p className="mb-3 text-lg text-[#8E8E8E]">{children}</p>
}

export default IntroText
