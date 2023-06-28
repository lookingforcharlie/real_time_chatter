'use client';

import axios from 'axios';
import { Check, UserPlus, X } from 'lucide-react';
// make sure useRouter import from 'next/navigation' as opposed to 'next/router', cos 'next/router' doesn't work anymore
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { pusherClient } from '../lib/pusher';
import { toPusherKey } from '../lib/utils';

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  // next provide this router hook
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  // use the pusherClient to subscribe to any changes the pusherServer provides for this user
  // and here we subscribe to the incoming request
  useEffect(() => {
    // now we are listening by subscribe
    // We can't use colon inside parameter of subscribe
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    console.log('listening to ', `user:${sessionId}:incoming_friend_requests`);

    const friendRequestHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      console.log('friendRequestHandler function got called');
      setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
    };

    // tell it what to do, bind a function with provided name
    pusherClient.bind('incoming_friend_requests', friendRequestHandler);

    // clean up function
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler);
    };
  }, [sessionId]);

  const acceptFriend = async (senderId: string) => {
    //TODO: Create this endpoint
    await axios.post('/api/friends/accept', {
      id: senderId,
    });

    // After we accepted the request, we will store it in state and refresh the page
    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    // refresh the page
    router.refresh();
  };

  const denyFriend = async (senderId: string) => {
    //TODO: Create this endpoint
    await axios.post('/api/friends/deny', {
      id: senderId,
    });

    // After we accepted the request, we will store it in state and refresh the page
    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    // refresh the page
    router.refresh();
  };
  return (
    <>
      {friendRequests.length === 0 ? (
        <p className='text-sm text-zinc-500 '>No friend requests for now...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className='flex gap-4 items-center'>
            <UserPlus className='text-black' />
            <p className='font-medium text-lg'>{request.senderEmail}</p>
            <button
              aria-label='accept friend'
              className='w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 grid place-items-center grounded-full transition hover:shadow-md'
              onClick={() => acceptFriend(request.senderId)}
            >
              <Check className='font-semibold text-white w-3/4 h-3/4' />
            </button>
            <button
              aria-label='deny friend'
              className='w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 grid place-items-center grounded-full transition hover:shadow-md'
              onClick={() => denyFriend(request.senderId)}
            >
              <X className='font-semibold text-white w-3/4 h-3/4' />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
