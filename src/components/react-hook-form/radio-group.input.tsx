/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Controller } from 'react-hook-form'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'

interface Option {
  label: string
  value: string
}

type FormRadioGroupProps = {
  name: string
  control: any
  label?: string
  options: Option[]
  disabled?: boolean
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  name,
  control,
  label,
  options,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <Controller
        name={name}
        control={control}
        defaultValue={options[0]?.value}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            {options.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} />
                <label htmlFor={`${name}-${opt.value}`} className="text-sm">
                  {opt.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  )
}

export default FormRadioGroup
