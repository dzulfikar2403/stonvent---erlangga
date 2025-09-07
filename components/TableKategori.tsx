"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
// import { getProduk } from "@/api/produkApi";
import { useQuery } from "@tanstack/react-query";
import { getKategori } from "@/api/kategoriApi";
import { Kategori } from "@/types/kategori";
import ModalEditKategori from "./ModalEditKategori";

export const columns: ColumnDef<Kategori>[] = [
  {
    accessorKey: "id_kategori",
    header: "Id",
    cell: ({ row }) => <div>{row.getValue("id_kategori")}</div>,
  },
  {
    accessorKey: "nama_kategori",
    header: "Nama Kategori",
    cell: ({ row }) => <div>{row.getValue("nama_kategori")}</div>,
  },
  {
    accessorKey: "action",
    header: "Aksi",
    cell: ({ row }) => {
      const kategoriEach = row.original;
      return <ModalEditKategori dataEach={kategoriEach}/>
    },
  },
];

export function TableKategori({dataItem}:{dataItem:Kategori[]}) {
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data: dataItem ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters as any,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="w-full space-y-4 py-2">
      <Input
        placeholder="Search Kategori..."
        value={
          (table.getColumn("nama_kategori")?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          table.getColumn("nama_kategori")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
