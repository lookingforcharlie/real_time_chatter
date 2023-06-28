'use client';

import { Message } from '@/lib/validations/message';
import { format } from 'date-fns';
import { is } from 'date-fns/locale';
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';
import { pusherClient } from '../lib/pusher';
import { cn, toPusherKey } from '../lib/utils';

interface MessagesProps {
  initialMessages: Message[]; // Message[] type is from validator
  sessionId: string;
  chatPartner: User;
  sessionImg: string | null | undefined;
  chatId: string;
}

const tempMsgs = [
  {
    id: '1',
    senderId: '3b7aedf3-a064-440c-9fc3-d1e4562c2909',
    text: 'Hello!',
    timestamp: 1623109200,
  },
  {
    id: '2',
    senderId: 'd81b0772-2e82-4d22-acec-a5ac60a215c1',
    text: 'How are you?',
    timestamp: 1623109300,
  },
  {
    id: '3',
    senderId: 'd81b0772-2e82-4d22-acec-a5ac60a215c1',
    text: "I'm doing well, thank you!",
    timestamp: 1623109400,
  },
  {
    id: '4',
    senderId: '3b7aedf3-a064-440c-9fc3-d1e4562c2909',
    text: "That's great to hear!",
    timestamp: 1623109500,
  },
  {
    id: '5',
    senderId: '3b7aedf3-a064-440c-9fc3-d1e4562c2909',
    text: 'What are you up to?',
    timestamp: 1623109600,
  },
  {
    id: '6',
    senderId: 'd81b0772-2e82-4d22-acec-a5ac60a215c1',
    text: "I'm working on a project.",
    timestamp: 1623109700,
  },
  {
    id: '7',
    senderId: 'd81b0772-2e82-4d22-acec-a5ac60a215c1',
    text: 'Sounds interesting!',
    timestamp: 1623109800,
  },
  {
    id: '8',
    senderId: 'd81b0772-2e82-4d22-acec-a5ac60a215c1',
    text: "Yes, it's quite challenging.",
    timestamp: 1623109900,
  },
  {
    id: '9',
    senderId: '3b7aedf3-a064-440c-9fc3-d1e4562c2909',
    text: 'I wish you the best of luck!',
    timestamp: 1623110000,
  },
  {
    id: '10',
    senderId: '3b7aedf3-a064-440c-9fc3-d1e4562c2909',
    text: 'Thank you!',
    timestamp: 1623110100,
  },
];

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  chatPartner,
  sessionImg,
  chatId,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  // const [messages, setMessages] = useState<Message[]>(tempMsgs);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };

    // tell it what to do, bind a function with provided name
    pusherClient.bind('incoming_message', messageHandler);

    // clean up function
    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind('incoming_message', messageHandler);
    };
  }, [chatId]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm dd/LL');
  };
  return (
    <div
      id='messages'
      // customized style defined in globals.css
      className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        // messages sent either by user or by chatPartner will determine it's shown on the right or left side, and different color
        // Login user on the right side, chatPartner on the left side
        const isCurrentUser = message.senderId === sessionId;

        // User image only show up at the last message
        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;
        return (
          <div
            key={`${message.id}-${message.timestamp}`}
            className='chat-message'
          >
            <div
              className={cn('flex items-end', { 'justify-end': isCurrentUser })}
            >
              <div
                className={cn(
                  'flex flex-col space-y-2 text-base max-w-xs mx-2',
                  {
                    'order-1 items-end': isCurrentUser,
                    'order-2 items-start': !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn('px-4 py-2 rounded-lg inline-block', {
                    'bg-indigo-500 text-white': isCurrentUser,
                    'bg-gray-200 text-gray-900': !isCurrentUser,
                    // only the last message sent concurrently has the edged border
                    'rounded-br-none':
                      !hasNextMessageFromSameUser && isCurrentUser,
                    'rounded-bl-none':
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {/* inserting a space using JavaScript */}
                  {message.text}{' '}
                  <span className='ml-2 text-xs text-gray-700'>
                    {/* {message.timestamp} */}
                    {formatTimestamp(message.timestamp)}
                  </span>
                </span>
              </div>

              {/* Implementing images */}
              <div
                className={cn('relative h-8 w-8', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <Image
                  fill
                  src={
                    isCurrentUser ? (sessionImg as string) : chatPartner.image
                  }
                  alt='Profile picture'
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
