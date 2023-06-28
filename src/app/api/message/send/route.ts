import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { fetchRedis } from '../../../../helpers/redis';
import { authOptions } from '../../../../lib/auth';
import { redis } from '../../../../lib/db';
import { pusherServer } from '../../../../lib/pusher';
import { toPusherKey } from '../../../../lib/utils';
import { Message, messageValidator } from '../../../../lib/validations/message';

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) return new Response('Unauthorized', { status: 401 });

    const [userId1, userId2] = chatId.split('--');

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response('Unauthorized', { status: 401 });
    }

    // verify which id is for which one, login user or friend of user
    const friendId = session.user.id === userId1 ? userId2 : userId1;

    // If the friendId is on the user's friend list, if not the friendId shouldn't even send the message
    // Retrieve the friendList of the login user from Redis db
    const friendList = (await fetchRedis(
      'smembers',
      `user:${session.user.id}:friends`
    )) as string[];

    // create a boolean value for if it's a friend
    const isFriend = friendList.includes(friendId);

    if (!isFriend) return new Response('Unauthorized', { status: 401 });

    const vintageSender = (await fetchRedis(
      'get',
      `user:${session.user.id}`
    )) as string;

    const sender = JSON.parse(vintageSender) as User;

    // all valid, send the message to the user
    // TODO: Notify the user that receive the message with real-time featured
    // TODO: Persist the message in the Redis DB

    const timestamp = Date.now();
    const messageData: Message = {
      id: crypto.randomUUID(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    // Notify all connected chat room client
    pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      'incoming_message', // name of the event
      message // data we want to pass to the function
    );

    await pusherServer.trigger(
      toPusherKey(`user:${friendId}:chats`),
      'new_message',
      {
        ...message,
        senderImg: sender.image,
        senderName: sender.name,
      }
    );

    // Add a sorted set in redis db, you will see 'zset' data structure in Redis, it means sorted list
    // zset associated with score
    await redis.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response('OK');
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
