import { z } from 'zod';

const payloadDataSchema = z.object({
  timestamp: z.string().datetime().optional(),
  value: z.number(),
});
export const sensorsDataSchema = z.object({
  payload: z.union([payloadDataSchema, z.array(payloadDataSchema).nonempty()]),
});

export type SensorsDataDto = z.infer<typeof sensorsDataSchema>;
export type SensorsPayloadDataDto = z.infer<typeof payloadDataSchema>;
