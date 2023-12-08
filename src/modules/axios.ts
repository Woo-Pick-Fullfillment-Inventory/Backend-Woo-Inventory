import axios from "axios";

import logger from "./logger.js";

import type { AxiosResponse } from "axios";

const getAxiosWithBasicAuth = async <T>(
  url: string,
  token: string,
): Promise<T | undefined> => {
  try {
    const response: AxiosResponse<T> = await axios.get(url, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    logger.error("axios error", error);
    return undefined;
  }
};

export { getAxiosWithBasicAuth };
