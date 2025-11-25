/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from "react"
import { Controller } from "react-hook-form"
import { cn } from "@/lib/utils" // helper para classnames, pode substituir por classnames ou template string

type TimePickerProps = {
  control: any
  name: string
  label?: string
  disabled?: boolean
  className?: string
}

export function FormTimePicker({
  control,
  name,
  label,
  disabled = false,
  className,
}: TimePickerProps) {
  // converte minutos para "HH:MM"
  const minutesToHHMM = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
  }

  // converte "HH:MM" para minutos
  const hhmmToMinutes = (value: string) => {
    const [h, m] = value.split(":").map(Number)
    if (isNaN(h) || isNaN(m)) return 0
    return h * 60 + m
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const timeValue = typeof value === "number" ? minutesToHHMM(value) : ""

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(hhmmToMinutes(e.target.value))
        }

        return (
          <div className="flex flex-col w-full">
            {label && <label className="mb-1 font-medium text-sm">{label}</label>}
            <input
              type="time"
              value={timeValue}
              onChange={handleChange}
              disabled={disabled}
              className={cn(
                "w-full rounded-md border border-input bg-[var(--card)] px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[var(--primary)]  disabled:cursor-not-allowed disabled:opacity-50",
                className,
                error && "border-destructive focus:ring-destructive"
              )}
              step={60} // intervalo de 1 minuto, pode ajustar
            />
            {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
          </div>
        )
      }}
    />
  )
}
