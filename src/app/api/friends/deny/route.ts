import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '../../../../lib/auth';
import { redis } from '../../../../lib/db';

// Logic code to accept friend
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // body only has id that is sent from the frontend
    // Validate if the id is a string.
    // const { id: idToAdd }: This is object destructuring syntax in JavaScript. It extracts the id property from the parsed and validated object and assigns it to a new variable named idToAdd.
    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Simply just remove the request
    await redis.srem(
      `user:${session.user.id}:incoming_friend_requests`,
      idToDeny
    );

    // It will return '500 Internal Server Error', if we don't return new Response('OK');
    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    // If you can't pinpoint what the error is
    return new Response('Invalid request', { status: 400 });
  }
}
