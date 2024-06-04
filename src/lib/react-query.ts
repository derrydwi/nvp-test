import { cache } from "react";

import { QueryClient, QueryClientConfig } from "@tanstack/react-query";

const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: STALE_TIME,
      retry: (failureCount) => {
        if (failureCount < 1) return true;
        return false;
      },
    },
    mutations: {
      onError: (error: Error) => {
        console.error(error.message);
      },
    },
  },
};

export const getQueryClient = cache(() => new QueryClient(queryClientConfig));
