import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { fetchRedis } from '../../../../helpers/redis';
import { authOptions } from '../../../../lib/auth';
import { redis } from '../../../../lib/db';
import { pusherServer } from '../../../../lib/pusher';
import { toPusherKey } from '../../../../lib/utils';
import { addFriendValidator } from '../../../../lib/validations/add-friend';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the input from the server side once again
    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    // emailToAdd is the input from front end
    // console.log('-----------');
    // console.log(body);
    // console.log('Email input by user from front end:', emailToAdd);
    // console.log('-----------');

    const RESTResponse = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: 'no-store',
      }
    );

    const data = (await RESTResponse.json()) as { result: string | null };

    // Redis will return the id only if the user can be found in Redis
    const idToAdd = data.result;
    // can't add a user that doesn't exist
    if (!idToAdd) {
      return new Response('This person does not exist.', { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Can't add yourself as friend
    if (idToAdd === session.user.id) {
      return new Response('Cannot add yourself as a friend', { status: 400 });
    }

    // Can't add a user that you already added before
    const isAlreadyAdded = (await fetchRedis(
      'sismember',
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new Response('Already added this user', { status: 400 });
    }

    // Can't add a user that you already added before
    const isAlreadyFriends = (await fetchRedis(
      'sismember',
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyFriends) {
      return new Response('Already Friends with this user', { status: 400 });
    }

    console.log('trigger trigger');

    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      'incoming_friend_requests',
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    );
    // Send friend request, and create the format of the request
    redis.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }
    return new Response('Invalid request', { status: 400 });
  }
}
