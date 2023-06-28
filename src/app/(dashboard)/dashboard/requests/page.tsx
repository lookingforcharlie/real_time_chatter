import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import AddFriendButton from '../../../../components/AddFriendButton';
import FriendRequests from '../../../../components/FriendRequests';
import { fetchRedis } from '../../../../helpers/redis';
import { authOptions } from '../../../../lib/auth';

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  //TODO: we want to find out who is sending the request
  // Friend Request format in Redis: user:RequestReceiverId:incoming_friend_request senderId.
  // Here we got all senderIds from Redis
  const incomingSenderIds = (await fetchRedis(
    'smembers',
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  //TODO: But we can't render Ids on the page, we need to get the email of the id
  // Promise.all: there is an array of Promise
  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      // why fetchRedis return a JSON string as opposed to an object
      const sender = await fetchRedis('get', `user:${senderId}`);
      const senderObj = JSON.parse(sender) as User;
      return {
        // senderId: senderObj.id,
        senderId,
        senderEmail: senderObj.email,
      };

      // Why sender is a JSON file as opposed to object?
      // return JSON.parse(sender);
    })
  );

  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Handle Add Requests</h1>
      {/* {incomingFriendRequests.map((item) => {
        return <div>{item.email}</div>;
      })} */}
      <div className='flex flex-col gap-4'>
        {/* We gonna use real time features inside <FriendRequests />  */}
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
};

export default page;

// sender from Redis:  {"name":"Charlie Feng","email":"charliefeng2020@gmail.com","image":"https://lh3.googleusercontent.com/a/AAcHTtfIyPiDcJpTEwEbfOiMkGq7zu5U5SMIdyNFPZ5W=s96-c","emailVerified":null,"id":"38fa241a-ab10-445e-a8e4-6cb5cd3209f0"}
