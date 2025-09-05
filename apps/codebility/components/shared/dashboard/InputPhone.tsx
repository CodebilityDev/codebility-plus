import React, { forwardRef } from "react";
import codes from "country-calling-code";
import { Controller } from "react-hook-form";

import { cn } from "@codevs/ui";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  id?: string;
  label: string;
  error?: string;
  type?: "email" | "phone";
  inputClassName?: string;
  disabled?: boolean;
  control?: any;
};

// eslint-disable-next-line react/display-name
const InputField = forwardRef<HTMLInputElement, InputProps>(
  (
    { id, label, error, type = "email", inputClassName, disabled, control },
    ref,
  ) => {
    const placeholderColor = disabled
      ? "lightgray dark:placeholder-gray"
      : "black-100 dark:placeholder-gray-400";

    // Validate phone number
    const validatePhoneNumber = (value: string) => {
      if (!value) return true;
      const [countryCode, phoneNumber] = value.split("-");

      if (!phoneNumber) return true;

      const cleanNumber = phoneNumber.replace(/\D/g, "");

      if (countryCode === "+63") {
        const normalizedNumber = cleanNumber.startsWith("0")
          ? cleanNumber.slice(1)
          : cleanNumber;

        if (!/^9\d{9}$/.test(normalizedNumber)) {
          return "Please enter a valid Philippine mobile number";
        }
      }

      if (cleanNumber.length < 6 || cleanNumber.length > 15) {
        return "Phone number must be between 6 and 15 digits";
      }

      return true;
    };

    const formatPhoneNumber = (phoneNumber: string, countryCode: string) => {
      if (!phoneNumber) return phoneNumber;

      let cleaned = phoneNumber.replace(/\D/g, "");

      if (countryCode === "+63") {
        if (cleaned.startsWith("0")) {
          cleaned = cleaned.slice(1);
        }
        if (cleaned.length >= 10) {
          return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        }
      }

      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    };

    const concatenateValues = (selectValue: string, inputValue: string) => {
      let newInputVal = inputValue || "";
      return `${selectValue}-${newInputVal}`;
    };

    if (type === "phone") {
      return (
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center">
            <label>{label}</label>
          </div>
          <div className="flex flex-row justify-evenly gap-6">
            <Controller
              control={control}
              name="phone_number"
              defaultValue=""
              rules={{
                validate: validatePhoneNumber,
              }}
              render={({ field: { onChange, onBlur, value }, fieldState }) => (
                <>
                  <select
                    disabled={disabled}
                    className={cn(
                      "md:text-md h-11 w-full rounded-sm border-transparent bg-transparent text-sm sm:text-sm lg:text-lg",
                      `placeholder-${placeholderColor}`,
                      "focus:outline-none",
                      inputClassName,
                    )}
                    value={(value && value.split("-")[0]) || ""}
                    onChange={(e) =>
                      onChange(
                        concatenateValues(
                          e.target.value,
                          value && value.split("-")[1],
                        ),
                      )
                    }
                    onBlur={onBlur}
                  >
                    <option
                      value=""
                      disabled
                      className="md:text-md dark:bg-dark-100 absolute h-52 overflow-y-auto border-white text-sm dark:border-zinc-700 sm:text-sm md:w-[200px] lg:text-lg"
                    >
                      Code
                    </option>
                    {codes.map((item, index) => (
                      <option
                        key={index}
                        className="md:text-md dark:bg-dark-100 absolute h-52 overflow-y-auto border-white text-sm dark:border-zinc-700 sm:text-sm md:w-[200px] lg:text-lg"
                        value={`+${item.countryCodes[0]?.replace(/-/, "")}`}
                      >
                        {item.country} (+
                        {item.countryCodes[0]?.replace(/-/, "")})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    id={id}
                    ref={ref}
                    value={
                      (value &&
                        formatPhoneNumber(
                          value.split("-")[1],
                          value.split("-")[0],
                        )) ||
                      ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      onChange(
                        concatenateValues(
                          value && value.split("-")[0],
                          rawValue,
                        ),
                      );
                    }}
                    onBlur={onBlur}
                    className={cn(
                      "md:text-md w-full bg-muted/50 text-sm disabled:opacity-50 sm:text-sm lg:text-lg",
                      `placeholder-${placeholderColor}`,
                      "rounded-sm p-2 focus:outline-none",
                      inputClassName,
                    )}
                    placeholder={label}
                    disabled={disabled}
                  />
                  {(error || fieldState.error?.message) && (
                    <p className="mt-2 text-sm text-red-400">
                      {error || fieldState.error?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      );
    }

    // Handle email input with Controller
    return (
      <div className="flex w-full flex-col gap-2">
        <label htmlFor={id}>{label}</label>
        <Controller
          control={control}
          name={id || "email"} // Ensure this matches your form field name
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <>
              <input
                type="email"
                id={id}
                ref={ref}
                className={cn(
                  "md:text-md text-black-500 w-full bg-muted/50 text-sm disabled:opacity-50 sm:text-sm lg:text-lg",
                  `placeholder-${placeholderColor}`,
                  "rounded-sm p-2 focus:outline-none",
                  inputClassName,
                )}
                placeholder={label}
                value={value || ""}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
              />
              {(error || fieldState.error?.message) && (
                <p className="mt-2 text-sm text-red-400">
                  {error || fieldState.error?.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    );
  },
);

export default InputField;
