"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useGetProducts } from "@/query/products";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ColumnFiltersState,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Pagination } from "@/components/pagination/pagination";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { columns } from "./columns";

type DataTableProps = {
  page: number;
  limit: number;
};

export function DataTable({ page, limit }: DataTableProps) {
  const router = useRouter();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize: limit,
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const getProducts = useGetProducts({
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
  });
  const getProductsMeta = useGetProducts({});

  const table = useReactTable({
    data: getProducts.data ?? [],
    columns,
    state: {
      pagination,
      columnFilters,
    },
    manualPagination: true,
    rowCount: getProductsMeta.data?.length,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
  });

  useEffect(() => {
    setPagination({ pageIndex: page, pageSize: limit });
  }, [page, limit]);

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
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
                            header.getContext(),
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
                        cell.getContext(),
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
      <div className="mt-4 flex justify-between">
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
            router.push(`?page=${1}&limit=${Number(value)}`);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={String(pageSize)}>
                Show {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Pagination
          forcePage={page}
          pageCount={Math.ceil(Number(getProductsMeta.data?.length) / limit)}
          onPageChange={(page) =>
            router.push(`?page=${page.selected + 1}&limit=${limit}`)
          }
        />
      </div>
    </div>
  );
}
