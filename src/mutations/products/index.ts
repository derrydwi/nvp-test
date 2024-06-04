import { useMutation } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";

import { getQueryClient } from "@/lib/react-query";

import { fetchData } from "@/utils/fetcher";
import { Product } from "@/utils/validations/products";

export const useCreateProduct = () => {
  return useMutation({
    mutationKey: ["products/createProduct"],
    mutationFn: ({ data }: { data: AxiosRequestConfig["data"] }) => {
      return fetchData<Product>({ url: `/products`, method: "POST", data });
    },
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ["products/getProducts"],
      });
    },
  });
};

export const useUpdateProductById = () => {
  return useMutation({
    mutationKey: ["products/updateProductById"],
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: AxiosRequestConfig["data"];
    }) => {
      return fetchData<Product>({
        url: `/products/${id}`,
        method: "PUT",
        data,
      });
    },
    onSuccess: (data) => {
      getQueryClient().invalidateQueries({
        queryKey: ["products/getProducts"],
      });
      getQueryClient().invalidateQueries({
        queryKey: ["products/getProductById", data.id],
      });
    },
  });
};

export const useDeleteProductById = () => {
  return useMutation({
    mutationKey: ["products/deleteProductById"],
    mutationFn: ({ id }: { id: number }) => {
      return fetchData<string>({ url: `/products/${id}`, method: "DELETE" });
    },
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ["products/getProducts"],
      });
    },
  });
};
