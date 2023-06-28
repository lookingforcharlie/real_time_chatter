import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { fetchRedis } from '../../../../helpers/redis';
import { authOptions } from '../../../../lib/auth';
import { redis } from '../../../../lib/db';

// Logic code to accept friend
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // body only has id that is sent from the frontend
    // Validate if the id is a string.
    // const { id: idToAdd }: This is object destructuring syntax in JavaScript. It extracts the id property from the parsed and validated object and assigns it to a new variable named idToAdd.
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Verify both users are not already friends using 'sismember'
    // 'sismember' means is a member of a set, it returns 1 if the member is present in the set, and 0 if it is not.
    const isAlreadyFriends = await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new Response(
        `${session.user.email} is already on your friend list.`,
        { status: 400 }
      );
    }

    // You only add those who send requests to friends
    const hasFriendRequest = await fetchRedis(
      'sismember',
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFriendRequest) {
      return new Response('No request from this friend', { status: 400 });
    }

    // Approve and add the friend in friends set in Redis DB
    await redis.sadd(`user:${session.user.id}:friends`, idToAdd);
    // Also adding user to requester's friend list, it's I am your friend, you are my friend automatically situation
    await redis.sadd(`user:${idToAdd}:friends`, session.user.id);

    // Clear up the friends request in Redis
    // outbound_friend_request supposes to belong to the requester, didn't implement at this point
    // await redis.srem(
    //   `user:${idToAdd}:outbound_friend_requests`,
    //   session.user.id
    // );

    // Remove the friend request
    await redis.srem(
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
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
