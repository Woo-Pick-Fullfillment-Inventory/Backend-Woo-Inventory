import axios from "axios";

import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

type InterceptorType = {
  onFulfillment: (response: AxiosResponse) => AxiosResponse;
  onRejected: (error: AxiosError) => Promise<AxiosError>;
};

type axiosOptions = {
  config: AxiosRequestConfig;
  interceptors: InterceptorType[];
};

const createAxiosClient = <R>({
  config,
  interceptors,
}: axiosOptions) => {
  const axiosClient = axios.create(config);

  interceptors.forEach((interceptor) => {
    axiosClient.interceptors.response.use(
      interceptor.onFulfillment,
      interceptor.onRejected,
    );
  });

  return {
    request: (config: AxiosRequestConfig) =>
      axiosClient.request<R, AxiosResponse<R>>(config),
    get: (url: string, config?: AxiosRequestConfig) =>
      axiosClient.get<R, AxiosResponse<R>>(url, config),
    post: <D>(url: string, data: D, config?: AxiosRequestConfig) =>
      axiosClient.post<R, AxiosResponse<R>>(url, data, config),
  };
};

export default createAxiosClient;
