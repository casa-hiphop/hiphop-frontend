/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Controller } from "react-hook-form"
import React from "react"
import { Textarea } from "../ui/textarea"

type Props = React.ComponentProps<"textarea"> & {
  name: string
  control: any,
  maxLength?: number,
  className?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
}

export function FormTextArea({
  name,
  control,
  maxLength,
  className,
  placeholder,
  defaultValue,
  disabled = false,
  ...rest
}: Props) {
  return (
    <div className="flex flex-col space-y-0.5">
      <Controller
        name={name}
        defaultValue={defaultValue || ''}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            let newValue = e.target.value

            if (maxLength) {
              newValue = newValue.slice(0, maxLength)
            }

            onChange(newValue)
          }

          return (
            <div className="flex flex-col space-y-0.5 text-left">
              <Textarea
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className={`mt-0.5 ${className} ${error && 'border-red-600 focus-visible:border-red-600'}`}
                disabled={disabled}
                {...rest}
              />
              {error && <p className="text-[0.8rem] pl-2 text-red-600">{error?.message}</p>}
            </div>
          )
        }}
      />
    </div>
  )
}
