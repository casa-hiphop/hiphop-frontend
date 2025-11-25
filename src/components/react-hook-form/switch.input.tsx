/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Controller } from 'react-hook-form'
import { Switch } from '@/components/ui/switch'

interface FormSwitchProps {
  name: string
  control: any
  label?: string
  disabled?: boolean
  onChange?: (newValue: boolean) => void
}

const FormSwitch: React.FC<FormSwitchProps> = ({
  name,
  control,
  label,
  disabled = false,
  onChange
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <Controller
        name={name}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <Switch
            checked={field.value}
            onCheckedChange={(newValue) => {
              if (onChange) onChange(newValue)
              field.onChange(newValue)
            }}
            disabled={disabled}
          />
        )}
      />
    </div>
  )
}

export default FormSwitch
