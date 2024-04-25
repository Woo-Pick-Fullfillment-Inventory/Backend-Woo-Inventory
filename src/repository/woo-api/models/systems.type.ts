import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const SystemStatusFromWooSchema = Type.Object({
  environment: Type.Object({
    home_url: Type.String(),
    site_url: Type.String(),
    version: Type.String(),
  }),
});

export type SystemStatusFromWooType = Static<typeof SystemStatusFromWooSchema>;
