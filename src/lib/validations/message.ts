import { z } from 'zod';

// Message type needs its own id
export const messageValidator = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string().max(2000),
  timestamp: z.number(),
});

export const messageArrayValidator = z.array(messageValidator);

export type Message = z.infer<typeof messageValidator>;
