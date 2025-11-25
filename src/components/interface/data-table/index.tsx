"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import React, { Dispatch, Fragment, SetStateAction } from "react"
import { IPagination, IPaginationResponse } from "@/dtos/pagination"

export interface IColumns<TOrderBy> {
  label: string
  name?: TOrderBy
  header?: React.ReactNode
  align?: 'center' | 'left' | 'right'
}

type Props<TData, TOrderBy> = {
  columns: IColumns<TOrderBy>[]
  data: IPaginationResponse<TData>
  pagination: IPagination
  setPagination: Dispatch<SetStateAction<IPagination>>
  visibilityColumns: string[]
  cells: { cell: (row: TData) => React.ReactNode }[]
}

export function DataTable<TData, TOrderBy>({
  columns,
  data,
  pagination,
  setPagination,
  visibilityColumns,
  cells
}: Props<TData, TOrderBy>) {
  const visibleColumnsAndCells = columns
    .map((column, i) => ({
      column,
      cell: cells[i],
    }))
    .filter(({ column }) => column.label && visibilityColumns.includes(column.label))

  return (
    <div className="absolute w-full">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {visibleColumnsAndCells.map(({ column }, i) => (
                <TableCell key={i} align={column.align || 'left'} className="font-medium px-6">
                  {column.header ? column.header : column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.list.length ? (
              data.list.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {visibleColumnsAndCells.map(({ cell }, i) => (
                    <Fragment key={i}>
                      {cell.cell(row)}
                    </Fragment>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.max(prev.page - 1, 1),
            }))
          }
          disabled={pagination.page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: prev.page + 1,
            }))
          }
          disabled={pagination.page >= data.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}