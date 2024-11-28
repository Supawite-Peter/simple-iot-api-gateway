import { z } from 'zod';

const payloadDataSchema = z.object({
  timestamp: z
    .union([
      z.string().datetime({ message: 'Invalid datetime format' }),
      z.coerce
        .number()
        .positive({ message: 'Timestamp must be greater than 0' }),
    ])
    .optional(),
  value: z.number(),
});
export const sensorsDataSchema = z.object({
  payload: z.union([payloadDataSchema, z.array(payloadDataSchema).nonempty()]),
});

export type SensorsDataDto = z.infer<typeof sensorsDataSchema>;
export type SensorsPayloadDataDto = z.infer<typeof payloadDataSchema>;
