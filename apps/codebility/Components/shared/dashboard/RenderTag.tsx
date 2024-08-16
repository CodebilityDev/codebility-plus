import React from "react"

interface Props {
  name?: string
  className?: string
}

const RenderTag = ({ name, className }: Props) => {
  return (
    <div
      className={`m-1 inline-flex items-center rounded-md bg-blue-600 px-2 py-1 text-[10px] uppercase text-white ${className}`}
    >
      {name}
    </div>
  )
}

export default RenderTag
