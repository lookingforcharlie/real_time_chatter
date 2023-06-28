// This is dynamic page, meaning we gonna use 'localhost:3000/dashboard/chat/oneSpecificChat' to determine which chat we gonna show to user
// Marking the page as a dynamic segment, make a folder [chat] and put page.tsx into the folder
// now 'localhost:3000/dashboard/chat/whatever' will show chat page instead of 404 page, but 'localhost:3000/dashboard/chat' will show 404 page
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ChatInput from '../../../../../components/ChatInput';
import Messages from '../../../../../components/Messages';
import { fetchRedis } from '../../../../../helpers/redis';
import { authOptions } from '../../../../../lib/auth';
import { redis } from '../../../../../lib/db';
import { messageArrayValidator } from '../../../../../lib/validations/message';

interface PageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessage(chatId: string) {
  try {
    // we are fetching everything in the set
    const results: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const dbMessage = results.map((message) => JSON.parse(message) as Message);

    // TODO: Display the message in a reversed order
    const reversedDbMessages = dbMessage.reverse();

    const messages = messageArrayValidator.parse(reversedDbMessages);
    return messages;
  } catch (error) {
    notFound();
  }
}

const page = async ({ params }: PageProps) => {
  // to see the skeleton effect
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;
  const sessionImg = user.image;

  // this is how we construct for the chat url
  const [userId1, userId2] = chatId.split('--');

  // The user can see this chat, only if the user is one of this two userIds
  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartner = (await redis.get(`user:${chatPartnerId}`)) as User;
  const initialMessages = await getChatMessage(chatId);

  return (
    <>
      <div>The Chat is between:</div>
      <div>{params.chatId}</div>
      {/* keep chat interface from overflow the page*/}
      <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-10rem)]'>
        <div className='flex sm:item-center justify-between py-3 border-b-2 border-gray-200'>
          <div className='relative flex items-center space-x-4'>
            <div className='relative'>
              <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
                <Image
                  fill
                  referrerPolicy='no-referrer'
                  src={chatPartner.image}
                  alt={`${chatPartner.name} profile picture`}
                  className='rounded-full'
                />
              </div>
            </div>

            <div className='flex flex-col leading-tight'>
              <div className='text-xl flex items-center'>
                <span className='text-gray-700 mr-3 font-semibold'>
                  {chatPartner.name}
                </span>
              </div>

              <span className='text-sm text-gray-600'>{chatPartner.email}</span>
            </div>
          </div>
        </div>

        <Messages
          initialMessages={initialMessages}
          sessionId={user.id}
          sessionImg={sessionImg}
          chatPartner={chatPartner}
          chatId={chatId}
        />
        <ChatInput chatPartner={chatPartner} chatId={chatId} />
      </div>
    </>
  );
};

export default page;
