import { ReactNode } from 'react'

type IInputLabelProps = {
    htmlFor: string
    required?: boolean
    children: ReactNode
}

const InputLabel = ({ htmlFor, required, children }: IInputLabelProps) => {
    return (
        <label htmlFor={htmlFor} className="font-light mb-1">
            {children}
            {required && <span className="ml-1 text-[#FF4242]">*</span>}
        </label>
    )
}

export default InputLabel