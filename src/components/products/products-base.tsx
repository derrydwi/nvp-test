"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ProductForm } from "./form/product-form";
import { DataTable } from "./table/data-table";

type ProductsBaseProps = {
  page: number;
  limit: number;
  search?: string;
};

export default function ProductsBase({
  page,
  limit,
  search,
}: ProductsBaseProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-fit gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <ProductForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
      <DataTable page={page} limit={limit} />
    </>
  );
}
