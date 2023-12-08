import axios from "axios";

import type { AxiosResponse } from "axios";

const getAxiosWithBasicAuth = async <T>(
  url: string,
  token: string,
  defaultValue: T | undefined = undefined,
): Promise<T | undefined> => {
  try {
    const response: AxiosResponse<T> = await axios.get(url, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    return defaultValue;
  }
};

export { getAxiosWithBasicAuth };