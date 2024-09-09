import React, { forwardRef } from "react";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  id?: string;
  label: string;
  error?: string;
  type?: string;
  inputClassName?: string;
  disabled?: boolean;
  register?: boolean;
  value?: string;
  control?: any;
};

// eslint-disable-next-line react/display-name
const InputProfile = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, error, type, inputClassName, disabled, ...props }, ref) => {
    const placeholderColor = disabled
      ? "lightgray dark:placeholder-gray"
      : "black-100 dark:placeholder-gray-400";

    return (
      <div className="border-lightgray flex w-full flex-row justify-between gap-1 border-b p-4 dark:border-zinc-700">
        <div className="flex basis-[15%] items-center pl-2">
          <p className="text-gray text-sm">{label}</p>
        </div>
        <div className="basis-[85%]">
          <input
            id={id}
            type={type}
            ref={ref}
            {...props}
            className={`w-full border-transparent bg-transparent text-lg placeholder-${placeholderColor} focus:outline-none ${inputClassName}`}
            placeholder={label}
            disabled={disabled}
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    );
  },
);

export default InputProfile;
