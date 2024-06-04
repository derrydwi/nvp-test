import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchData } from "@/utils/fetcher";
import { Product } from "@/utils/validations/products";

export const getProductsConfig = (
  params: Record<string, string | number | undefined>,
) => {
  return {
    queryKey: ["products/getProducts", params],
    queryFn: () => fetchData<Product[]>({ url: "/products", params }),
    placeholderData: keepPreviousData,
  };
};

export const useGetProducts = (
  params: Record<string, string | number | undefined>,
) => {
  return useQuery(getProductsConfig(params));
};
