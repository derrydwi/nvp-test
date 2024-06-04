import { useState } from "react";

import { useRouter } from "next/navigation";

import { useDeleteProductById } from "@/mutations/products";
import { ColumnDef, Getter } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { PropagationStopper } from "@/components/utility/propagation-stopper";

import { Product } from "@/utils/validations/products";

import { ProductForm } from "../form/product-form";

const ActionCell = ({ product }: { product: Product }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const deleteProductById = useDeleteProductById();

  const handleDeleteProduct = () => {
    deleteProductById.mutate(
      { id: product.id },
      {
        onSuccess: () => {
          toast({
            title: "User deleted",
          });
          router.refresh();
        },
        onError: (error) => {
          toast({
            title: "Failed to delete user",
            variant: "destructive",
            description: (error as FetchError)?.error,
          });
        },
      },
    );
  };

  return (
    <PropagationStopper>
      <Dialog open={open} onOpenChange={setOpen}>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger asChild>
                <DropdownMenuItem>Edit product</DropdownMenuItem>
              </DialogTrigger>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Delete product</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <AlertDialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </AlertDialogHeader>
            <ProductForm product={product} setOpen={setOpen} />
          </DialogContent>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProduct}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Dialog>
    </PropagationStopper>
  );
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }: { getValue: Getter<number> }) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(getValue());
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell product={row.original} />,
  },
];
