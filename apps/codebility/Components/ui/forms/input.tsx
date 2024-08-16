import React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isKeyboard?: boolean
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ isKeyboard, ...props }, ref) => {
  const disableKeyboardInput = (e: any) => {
    e.preventDefault()
  }
  return (
    <input
      className="border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none"
      {...props}
      ref={ref}
      onKeyDown={isKeyboard ? disableKeyboardInput : () => {}}
    />
  )
})

export default Input
