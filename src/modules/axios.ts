import axios from "axios";

import type { AxiosResponse } from "axios";

const axiosGetRequest = async <T>(
  url: string,
  authenticationToken: string,
): Promise<T | undefined> => {
  try {
    const response: AxiosResponse<T> = await axios.get(url, { headers: { Authorization: authenticationToken } });
    return response.data;
  } catch (error) {
    return undefined;
  }
};

export { axiosGetRequest };
