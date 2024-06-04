import { Dispatch, SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { useCreateProduct, useUpdateProductById } from "@/mutations/products";
import { useGetCategories } from "@/query/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

import { formatUrl } from "@/utils/helpers";
import {
  CreateProduct,
  Product,
  createProductSchema,
} from "@/utils/validations/products";

type FormProductProps = {
  product?: Product | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function ProductForm({ product, setOpen }: FormProductProps) {
  const getCategories = useGetCategories({});
  const createProduct = useCreateProduct();
  const updateProductById = useUpdateProductById();

  const router = useRouter();

  const form = useForm<CreateProduct>({
    defaultValues: {
      title: product?.title ?? "",
      price: product?.price ?? 0,
      description: product?.description ?? "",
      categoryId: product?.category.id ?? 0,
      images: product?.images.map((image) => formatUrl(image)) ?? [""],
    },
    resolver: zodResolver(createProductSchema),
    mode: "all",
  });

  const onSubmit: SubmitHandler<CreateProduct> = (data) => {
    if (product) {
      updateProductById.mutate(
        { id: product?.id as number, data },
        {
          onSuccess: () => {
            toast({
              title: "Product updated",
            });
            setOpen((prev) => !prev);
            router.refresh();
          },
          onError: (error) => {
            toast({
              title: "Failed to update product",
              variant: "destructive",
              description: (error as FetchError)?.error,
            });
          },
        },
      );
    } else {
      createProduct.mutate(
        { data },
        {
          onSuccess: () => {
            toast({
              title: "Product created",
            });
            setOpen((prev) => !prev);
            router.refresh();
          },
          onError: (error) => {
            toast({
              title: "Failed to create product",
              variant: "destructive",
              description: (error as FetchError)?.error,
            });
          },
        },
      );
    }
  };

  console.log("form", form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Insert title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="Insert price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Insert description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getCategories.data?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("images").map((_, index) => (
          <div key={`images-${index}`} className="flex items-end gap-2">
            <FormField
              control={form.control}
              name={`images.${index}`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Images {index + 1}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Insert images ${index + 1}`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("images").length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  form.setValue(
                    "images",
                    form
                      .getValues("images")
                      .filter((_, currentIndex) => currentIndex !== index),
                  );
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          className=""
          onClick={() => {
            form.setValue("images", [...form.getValues("images"), ""]);
          }}
        >
          <Plus className="h-4 w-4" /> Add Image
        </Button>
        <DialogFooter>
          <Button type="button" onClick={form.handleSubmit(onSubmit)}>
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
