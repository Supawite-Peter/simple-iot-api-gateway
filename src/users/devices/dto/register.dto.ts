import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(1),
    topics: z.array(z.string().min(1)),
  })
  .partial({
    topics: true,
  });

export type RegisterDto = z.infer<typeof registerSchema>;
