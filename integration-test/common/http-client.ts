import axios from "axios";

import type { AxiosRequestConfig } from "axios";

//const PORT = process.env["SERVICE_PORT"] || 3000;

export const instance = axios.create({
  baseURL: "http://localhost:3000",
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
