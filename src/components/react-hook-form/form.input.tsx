/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Input } from "@/components/ui/input"
import { Controller } from "react-hook-form"
import React from "react"
import { formatCEP, formatCurrency, formatDocumento, formatTelefone } from "@/utils/masks"

type Props = React.ComponentProps<"input"> & {
  name: string
  type?: "text" | "email" | "password" | "number"
  mask?: masksEnum
  control: any,
  maxLength?: number,
  className?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
}

export enum masksEnum {
  PHONE = 'phone',
  DOCUMENT = 'document',
  CEP = 'cep',
  CURRENCY = 'currency',
}

export function FormInput({
  name,
  type = "text",
  mask,
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
          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let newValue = e.target.value

            if (maxLength) {
              newValue = newValue.slice(0, maxLength)
            }

            switch (mask) {
              case masksEnum.PHONE:
                newValue = formatTelefone(newValue)
                break
              case masksEnum.DOCUMENT:
                newValue = formatDocumento(newValue)
                break
              case masksEnum.CEP:
                newValue = formatCEP(newValue)
                break
              case masksEnum.CURRENCY:
                newValue = formatCurrency(newValue)
                break
            }

            onChange(newValue)
          }

          return (
            <div className="flex flex-col space-y-0.5 text-left">
              <Input
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className={`h-9 mt-0.5 ${className} ${error && 'border-red-600 focus-visible:border-red-600'}`}
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
