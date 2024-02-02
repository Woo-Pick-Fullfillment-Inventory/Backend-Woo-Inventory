import axios from "axios";

import type { AxiosRequestConfig } from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:8080",
  validateStatus: () => true,
});

export const httpClient = {
  get: async (url: string, config?: AxiosRequestConfig) => {
    await Promise.resolve();
    return instance.get(url, config);
  },
  post: async <T>(url: string, data: T, config?: AxiosRequestConfig) => {
    await Promise.resolve();
    return instance.post(url, data, config);
  },
  patch: async <T>(url: string, data: T, config?: AxiosRequestConfig) => {
    await Promise.resolve();
    return instance.patch(url, data, config);
  },
};
