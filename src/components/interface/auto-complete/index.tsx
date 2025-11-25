'use client'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { useState } from "react"

type Data<TData> = TData & {
  id: string
}

type Props<TItem> = {
  selectedItems: string[]
  isLoading: boolean
  toggleOption: (item: Data<TItem>) => Promise<void>
  data: Data<TItem>[]
  label: keyof Data<TItem>
}

export default function AutoComplete<TItem>({
  selectedItems,
  isLoading,
  toggleOption,
  data,
  label
}: Props<TItem>) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredItems = (data ?? []).filter(item =>
    String(item[label]).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          variant="outline"
          className="justify-start overflow-visible whitespace-normal sx:w-full h-auto items-start"
        >
          <span className="shrink break-words w-full text-left">
            {selectedItems.length > 0
              ? `${data.filter((item) => selectedItems.includes(item.id)).map((dataset) => dataset[label]).join(" / ")}`
              : isLoading
                ? "Loading..."
                : "Select..."}
          </span>
        </Button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Content
        side="bottom"
        align="start"
        sideOffset={4}
        className={cn(
          "z-50 rounded-md border bg-popover p-0.5 text-popover-foreground shadow-md outline-none max-h-[40vh] overflow-auto",
        )}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement

          if (target.closest('[data-radix-dialog-content]')) {
            e.preventDefault()
          }
        }}
      >
        <Command>
          <div className="p-2">
            <Input
              placeholder="Search datasets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CommandGroup>
            {filteredItems.length > 0 ? (
              filteredItems.map((option) => {
                const isSelected = selectedItems.some(item => item === option.id)
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => toggleOption(option)}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleOption(option)}
                    />
                    <span>{`${option[label as keyof Data<TItem>]}`}</span>
                  </CommandItem>
                )
              })
            ) : (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                No dataset found.
              </div>
            )}
          </CommandGroup>
        </Command>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  )
}