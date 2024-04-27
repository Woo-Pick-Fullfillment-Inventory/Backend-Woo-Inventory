import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const ImageWooSchema = Type.Object({
  id: Type.Number(),
  src: Type.String(),
});

export type ImageWooType = Static<typeof ImageWooSchema>;