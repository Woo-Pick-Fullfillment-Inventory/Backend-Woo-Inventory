import { Type } from "@sinclair/typebox";

import createAxiosClient from "../../modules/axios.js";

import type { Static } from "@sinclair/typebox";

const SystemStatus = Type.Object({
  environment: Type.Object({
    home_url: Type.String(),
    site_url: Type.String(),
    version: Type.String(),
  }),
});

type SystemStatusType = Static<typeof SystemStatus>;

export const getSystemStatus = async (baseUrl: string, token: string): Promise<SystemStatusType> => {
  const { get } = createAxiosClient<SystemStatusType>({
    config: {
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    interceptors: [
      {
        onTrue: (response) => response,
        onError: (error) => error,
      },
    ],
  });
  const { data } = await get("/wp-json/wc/v3/system_status", { headers: { Authorization: token } });
  return data;
};