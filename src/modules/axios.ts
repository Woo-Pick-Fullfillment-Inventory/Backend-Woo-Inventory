/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

import type { AxiosResponse } from "axios";

interface ApiResponse<T> {
  data: T;
}

const getAxiosWithBasicAuth = async <T>(url: string, token: string): Promise<T> => {
  const headers = { Authorization: `Basic ${token}` };

  const response: AxiosResponse<ApiResponse<T>> = await axios.get(url, { headers });
  return response.data.data;
};

const postAxios = async <T>(url: string, data: any): Promise<T> => {
  const response: AxiosResponse<ApiResponse<T>> = await axios.post(url, data);
  return response.data.data;
};

export {
  getAxiosWithBasicAuth,
  postAxios,
};
