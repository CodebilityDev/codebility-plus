import React, { forwardRef } from "react"
import codes from "country-calling-code"
import { Controller } from "react-hook-form"
import { cn } from "@codevs/ui"

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  id?: string
  label: string
  error?: string
  type?: string
  inputClassName?: string
  disabled?: boolean
  register?: boolean
  value?: string
  control?: any
}

// eslint-disable-next-line react/display-name
const InputPhone = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, error, type, inputClassName, disabled, control }, ref) => {
    const placeholderColor = disabled ? "lightgray dark:placeholder-gray" : "black-100 dark:placeholder-gray-400"

    const concatenateValues = (selectValue: string, inputValue: string) => {
      let NewInputVal = ""
      if (inputValue !== undefined) {
        NewInputVal = inputValue
      }
      return `${selectValue}-${NewInputVal}`
    }

    return (
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center">
          <label>{label}</label>
        </div>
        <div className="flex flex-row justify-evenly gap-6">
          <Controller
            control={control}
            name="phone_no"
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <select
                  disabled={disabled}
                  className={`md:text-md h-11 w-full rounded-sm border-transparent bg-transparent text-sm sm:text-sm lg:text-lg placeholder-${placeholderColor} focus:outline-none ${inputClassName}`}
                  value={(value && value.split("-")[0]) || ""}
                  onChange={(e) => onChange(concatenateValues(e.target.value, value && value.split("-")[1]))}
                  onBlur={onBlur}
                >
                  <option
                    value=""
                    disabled
                    className="md:text-md absolute h-52 overflow-y-auto border-white text-sm dark:border-zinc-700 dark:bg-dark-100 sm:text-sm md:w-[200px] lg:text-lg"
                  >
                    Code
                  </option>
                  {codes.map((item, index) => (
                    <option
                      key={index}
                      className="md:text-md absolute h-52 overflow-y-auto border-white text-sm dark:border-zinc-700 dark:bg-dark-100 sm:text-sm md:w-[200px] lg:text-lg"
                      value={`+${item.countryCodes[0]?.replace(/-/, "")}`}
                    >
                      {item.country} (+{item.countryCodes[0]?.replace(/-/, "")})
                    </option>
                  ))}
                </select>
                <input
                  type={type}
                  id={id}
                  ref={ref}
                  value={(value && value.split("-")[1]) || ""}
                  onChange={(e) => onChange(concatenateValues(value && value.split("-")[0], e.target.value))}
                  onBlur={onBlur}
                  className={cn(
                    `md:text-md w-full bg-muted/50 text-sm disabled:opacity-50 sm:text-sm lg:text-lg placeholder-${placeholderColor} rounded-sm p-2  focus:outline-none ${inputClassName}`
                  )}
                  placeholder={label}
                  disabled={disabled}
                />
              </>
            )}
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
      </div>
    )
  }
)

export default InputPhone
