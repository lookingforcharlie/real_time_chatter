import { ChevronRight } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFriendsByUserId } from '../../../helpers/get-friends-by-user-id';
import { fetchRedis } from '../../../helpers/redis';
import { authOptions } from '../../../lib/auth';
import { chatHrefConstructor } from '../../../lib/utils';

const page = async () => {
  // get the session
  const session = await getServerSession(authOptions);
  // we got the session that contains id, name, email, and image
  // Now we can verify the session throughout the entire app
  console.log('--------------------');
  console.log('Next auth session got from dashboard page.tsx:', session);
  console.log('--------------------');

  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  // Render each friend's last message out on page
  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      // destructure the first element of the array
      const [lastMessageVintage] = (await fetchRedis(
        'zrange',
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[];

      console.log('lastMessage', lastMessageVintage);

      const lastMessage = JSON.parse(lastMessageVintage) as Message;

      return {
        ...friend,
        lastMessage,
      };
    })
  );

  // console.log('friendsWithLastMessage', friendsWithLastMessage);

  return (
    <div className='container py-12'>
      <h1 className='font-bold text-5xl mb-8'>Recent Chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className='text-sm text-zinc-500'>No Recent Chats</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className='relative bg-zinc-50 border border-zinc-200 p-3 rounded-md'
          >
            <div className='absolute right-4 inset-y-0 flex items-center'>
              <ChevronRight className='h-7 w-7 text-zinc-400' />
            </div>

            {/* Link to the full chat */}
            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className='relative sm:flex'
            >
              <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                <div className='relative h-6 w-6'>
                  <Image
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div>
                <h4 className='text-lg font-semibold'>{friend.name}</h4>
                <p className='mt-1 max-w-md'>
                  <span className='text-zinc-400'>
                    {friend.lastMessage.senderId === session.user.id
                      ? 'You: '
                      : ''}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default page;

// this is how session looks like
// {"user":{"name":"Bino Feng","email":"bino.feng@gmail.com","image":"https://lh3.googleusercontent.com/a/AAcHTtcaHUWfewaYBGHHYAbGaefaadsfas3lC2ngdUa4B-=s96-c","id":"6543b13d-adsefawef-wefe--be014c98dc2c"}}
