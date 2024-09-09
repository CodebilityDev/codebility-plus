import { ReactNode } from "react";

type IInputLabelProps = {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
};

const InputLabel = ({ htmlFor, required, children }: IInputLabelProps) => {
  return (
    <label htmlFor={htmlFor} className="mb-1 font-light">
      {children}
      {required && <span className="ml-1 text-[#FF4242]">*</span>}
    </label>
  );
};

export default InputLabel;
