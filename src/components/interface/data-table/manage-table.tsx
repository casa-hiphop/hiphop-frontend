'use client'

import { Check, ChevronsDown, ChevronsUp, Wrench } from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { IColumns } from "."
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { IOrderBy } from "@/dtos/order-by"
import { useIsMobile } from "@/hooks/use-mobile"

type Props<TOrderBy> = {
  columns: IColumns<TOrderBy>[]

  openOrderBy: boolean
  setOpenOrderBy: Dispatch<SetStateAction<boolean>>
  openColumns: boolean
  setOpenColumns: Dispatch<SetStateAction<boolean>>

  orderBy: IOrderBy<TOrderBy>
  setOrderBy: Dispatch<SetStateAction<IOrderBy<TOrderBy>>>
  visibilityColumns: string[]
  setVisibilityColumns: Dispatch<SetStateAction<string[]>>
}

export default function ManageTable<TOrderBy>({
  columns,
  openOrderBy,
  setOpenOrderBy,
  orderBy,
  setOrderBy,
  visibilityColumns,
  setVisibilityColumns,
  openColumns,
  setOpenColumns,
}: Props<TOrderBy>) {
  const isMobile = useIsMobile()

  function handleChangeVisibilityColumns(label: string) {
    setVisibilityColumns((prev) => {
      const newVisibilityColumns = prev.includes(label)
        ? prev.filter((column) => column !== label)
        : [...prev, label]


      if (newVisibilityColumns.length === 0) {
        return prev
      }

      return newVisibilityColumns
    })
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size={isMobile ? 'lg' : 'default'}>
              <Wrench />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end">Configurações da tabela</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="shadow-none flex flex-col gap-1" align="end" side="bottom">
        <Popover open={openOrderBy} onOpenChange={setOpenOrderBy}>
          <div className="flex items-center gap-1">
            <PopoverTrigger asChild>
              <Button variant="ghost" className="min-w-[200px] justify-start">
                Ordenado por &quot;{columns.find((column) => column.name === orderBy.orderBy)?.label}&quot;
              </Button>
            </PopoverTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  onClick={() => setOrderBy((prev) => ({
                    ...prev,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc'
                  }))}
                >
                  {orderBy.direction === 'asc' ? <ChevronsUp /> : <ChevronsDown />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end">
                Ordem {orderBy.direction === 'asc' ? 'crescente' : 'decrescente'}
              </TooltipContent>
            </Tooltip>
          </div>
          <PopoverContent
            className="p-0 mr-1"
            side={isMobile ? 'bottom' : "right"}
            align={isMobile ? 'end' : "start"}
          >
            <Command>
              <CommandInput placeholder="Ordenar por..." />
              <CommandList>
                <CommandEmpty>Sem resultados</CommandEmpty>
                <CommandGroup>
                  {columns.filter((column) => column.name).map((column, i) => (
                    <CommandItem
                      className="flex items-center justify-between cursor-pointer"
                      key={i}
                      value={column.label}
                      onSelect={() => {
                        setOrderBy((prev: IOrderBy<TOrderBy>) => ({
                          ...prev,
                          orderBy: column.name as TOrderBy
                        }))
                        setOpenOrderBy(false)
                      }}
                    >
                      {column.label}
                      {column.name === orderBy.orderBy && <Check strokeWidth="2.5" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={openColumns} onOpenChange={setOpenColumns}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="min-w-[200px] justify-start">
              Colunas
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={`p-0 ${isMobile ? 'mt-1' : 'mx-1'}`}
            side={isMobile ? 'bottom' : "right"}
            align={isMobile ? 'end' : "start"}
          >
            <Command>
              <CommandInput placeholder="Coluna..." />
              <CommandList>
                <CommandEmpty>Sem resultados</CommandEmpty>
                <CommandGroup>
                  {columns.map((column, i) => {
                    const isChecked = visibilityColumns.includes(column.label)

                    return (
                      <CommandItem
                        key={i}
                        value={column.label}
                        onSelect={(value) => {
                          handleChangeVisibilityColumns(value)
                        }}
                        className="flex items-center justify-between"
                      >
                        <span>{column.label}</span>
                        {isChecked && <Check />}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}