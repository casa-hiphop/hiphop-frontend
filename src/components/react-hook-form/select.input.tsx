/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Controller } from 'react-hook-form'

export interface Option {
  label: string
  value: string
}

interface FormSelectProps {
  name: string
  control: any
  options: Option[]
  placeholder?: string
  disabled?: boolean
}

export const FormSelect = ({
  name,
  control,
  options,
  placeholder = 'Selecione...',
  disabled = false,
}: FormSelectProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error && (
            <p className="text-sm text-red-500">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}
