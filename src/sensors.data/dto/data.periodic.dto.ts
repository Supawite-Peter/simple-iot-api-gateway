import { z } from 'zod';

const timestampSchema = z.union([
  z.string().datetime({ message: 'Invalid datetime format' }),
  z.coerce.number().positive({ message: 'Timestamp must be greater than 0' }),
]);

export const sensorsDataPeriodicSchema = z.object({
  from: timestampSchema,
  to: timestampSchema,
  unix: z.coerce.boolean().default(false).optional(),
});
export type SensorsDataPeriodicDto = z.infer<typeof sensorsDataPeriodicSchema>;
