'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { pusherClient } from '../lib/pusher';
import { toPusherKey } from '../lib/utils';

interface FriendRequestsSidebarOptionProps {
  initialUnseenRequestCount: number;
  sessionId: string;
}

const FriendRequestsSidebarOption: FC<FriendRequestsSidebarOptionProps> = ({
  initialUnseenRequestCount,
  sessionId,
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    // console.log('listening to ', `user:${sessionId}:incoming_friend_requests`);

    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const friendRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1);
    };

    // tell it what to do, bind a function with provided name
    pusherClient.bind('incoming_friend_requests', friendRequestHandler);

    // After handle one of the request, the number will be decremented by 1
    const addedFriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1);
    };
    pusherClient.bind('new_friend', addedFriendHandler);

    // clean up function
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler);

      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind('new_friend', addedFriendHandler);
    };
  }, [sessionId]);

  return (
    <Link
      href='/dashboard/requests'
      className='text-gray-700 hover:text-indigo-600 hover:bg-gray-100 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
    >
      <div className='text-gray-400 border border-gray-300 rounded-lg p-0.5 bg-white group-hover:text-indigo-600 group-hover:border-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium'>
        <User className='h-4 w-4' />
      </div>
      <p className='truncate'>Friend Requests</p>
      {unseenRequestCount > 0 ? (
        <div className='rounded-full w-5 h-5 text-xs flex items-center justify-center bg-indigo-600 text-white'>
          {unseenRequestCount}
        </div>
      ) : null}
    </Link>
  );
};

export default FriendRequestsSidebarOption;
