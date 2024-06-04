import { getCategoriesConfig } from "@/query/categories";
import { getProductsConfig } from "@/query/products";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import ProductsBase from "@/components/products/products-base";
import { ThemeToggle } from "@/components/toggle/theme-toggle";

import { getQueryClient } from "@/lib/react-query";

type ProductsPageProps = {
  searchParams: Record<string, string | undefined>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const queryClient = getQueryClient();

  const page = Number(searchParams.page ?? 1) - 1;
  const limit = Number(searchParams.limit ?? 5);
  const offset = page * limit;

  await Promise.all([
    queryClient.prefetchQuery(getProductsConfig({})),
    queryClient.prefetchQuery(getProductsConfig({ offset, limit })),
    queryClient.prefetchQuery(getCategoriesConfig({})),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ThemeToggle />
      <ProductsBase page={page} limit={limit} />
    </HydrationBoundary>
  );
}
