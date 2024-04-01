import axios from "axios";

import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

type InterceptorType = {
  onTrue: (response: AxiosResponse) => AxiosResponse;
  onError: (error: AxiosError) => AxiosError;
};

type axiosOptions = {
  config: AxiosRequestConfig;
  interceptors: InterceptorType[];
};

const createAxiosClient = <T>({
  config,
  interceptors,
}: axiosOptions) => {
  const axiosClient = axios.create(config);

  interceptors.forEach((interceptor) => {
    axiosClient.interceptors.response.use(
      interceptor.onTrue,
      interceptor.onError,
    );
  });

  return {
    get: (url: string, config?: AxiosRequestConfig) =>
      axiosClient.get<T, AxiosResponse<T>>(url, config),
  };
};

export default createAxiosClient;
