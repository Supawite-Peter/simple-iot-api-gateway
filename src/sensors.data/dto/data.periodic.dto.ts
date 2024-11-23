import { z } from 'zod';

export const sensorsDataPeriodicSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
});
export type SensorsDataPeriodicDto = z.infer<typeof sensorsDataPeriodicSchema>;
