import React, { ReactNode } from "react"

interface Button {
  children: ReactNode
  className?: string
}

const Button: React.FC<Button> = ({ children, className }) => {
  return (
    <button className={`flex w-[100px] items-center justify-center gap-2 rounded-lg px-5 py-1.5 ${className}`}>
      {children}
    </button>
  )
}

export default Button

// todo
// 1. add hollow
// 2. add solid
// 3. add solid with icon
// 4. add hollow with icon
// 5. add solid with icon and text
// 6. add hollow with icon and text
