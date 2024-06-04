type FetchError = {
  error?: string;
  message?: string;
  code?: number;
} | null;

type Meta = {
  limit: number;
  page: number;
  pages: number;
  total: number;
};
