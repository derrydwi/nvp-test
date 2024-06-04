import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchData } from "@/utils/fetcher";
import { Category } from "@/utils/validations/categories";

export const getCategoriesConfig = (
  params: Record<string, string | number | undefined>,
) => {
  return {
    queryKey: ["categories/getCategories", params],
    queryFn: () => fetchData<Category[]>({ url: "/categories", params }),
    placeholderData: keepPreviousData,
  };
};

export const useGetCategories = (
  params: Record<string, string | number | undefined>,
) => {
  return useQuery(getCategoriesConfig(params));
};
