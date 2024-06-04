import axios from "@/lib/axios";
import { AxiosError, AxiosRequestConfig, Method } from "axios";

type Params = Record<string, any>;

type FetchData = AxiosRequestConfig & {
  url: string;
  method?: Method;
  params?: Params;
};

type CommonResponse<R> = R;

export const fetchData = async <R>({
  url,
  method,
  params,
  ...rest
}: FetchData): Promise<R> => {
  try {
    const response = await axios.request<CommonResponse<R>>({
      url,
      method,
      params,
      ...rest,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<CommonResponse<R>>;
    throw axiosError.response?.data ?? error;
  }
};
