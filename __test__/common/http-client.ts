import axios from "axios";
import dotenv from "dotenv";

import type { AxiosRequestConfig } from "axios";
dotenv.config();
const PORT = process.env["SERVICE_PORT"] || 5000;

export const instance = axios.create({
  baseURL: `http://127.0.0.1:${PORT}`,
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
