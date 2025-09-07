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
import { getProduk } from "@/api/produkApi";
import { useQuery } from "@tanstack/react-query";
import ModalEditProduk from "./ModalEditProduk";
import Image from "next/image";

export const columns: ColumnDef<Produk>[] = [
  {
    accessorKey: "id_produk",
    header: "Id",
  },
  {
    accessorKey: "nama_produk",
    header: "Nama",
    cell: ({ row }) => <div>{row.getValue("nama_produk")}</div>,
  },
  {
    accessorKey: "nama_kategori",
    header: "Kategori",
  },
  {
    accessorKey: "foto_produk",
    header: "img",
    cell: ({row}) => {
      const produkEach = row.original;
      const first_image = produkEach.foto_produk?.split('||')[0] ?? "https://placehold.co/600x400/png";
      return <div className="relative w-8 h-8">
        <Image 
          src={first_image} 
          alt={produkEach.nama_produk}
          fill
          className="object-cover"
          />
      </div>
    }
  },
  {
    accessorKey: "kode_produk",
    header: "Kode Produk",
  },
  {
    accessorKey: "jumlah_barang",
    header: "Stok",
  },
  {
    accessorKey: "tgl_update_produk",
    header: "Update Terakhir",
    cell: ({row}) => {
      const dataEach = row.original;
      return <div>{new Date(dataEach.tgl_update_produk).toDateString()}</div>
    }
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const produkEach = row.original; // data asli per baris

      return <ModalEditProduk dataEach={produkEach} />
    },
  },
];

export function TableProduk({dataItem}:{dataItem:Produk[]}) {
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
        placeholder="Search Produk..."
        value={
          (table.getColumn("nama_produk")?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          table.getColumn("nama_produk")?.setFilterValue(event.target.value)
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
