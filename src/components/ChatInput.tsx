'use client';

import axios from 'axios';
import { Send } from 'lucide-react';
import { resolve } from 'path';
import { FC, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import TextareaAutosize from 'react-textarea-autosize';
import Button from './ui/Button';

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input) return;
    if (input.trim() === '') return;

    setIsLoading(true);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      await axios.post('/api/message/send', {
        text: input,
        chatId,
      });
      setInput('');
      textareaRef.current?.focus();
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className='border-t border-gray-300 px-4 pt-4 mb-2 sm:mb-0'>
      <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
        {/* Creating a text area can change its size depending on the length of the content */}
        {/* We are using react-textarea-autosize npm package to realize it */}
        {/* When press 'enter', send the msg, if press 'shift + enter', make a new line. */}
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder={`Message ${chatPartner.name}`}
          className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 leading-6'
        />

        {/* Make extra space for <TextareaAutosize /> */}
        <div
          onClick={() => textareaRef.current?.focus()}
          className='py-2'
          aria-hidden='true'
        >
          <div className='py-px'>
            <div className='h-6' />
          </div>
        </div>

        <div className='absolute bottom-2 right-2'>
          <div className='flex-shrink-0'>
            <Button
              className='px-6'
              onClick={sendMessage}
              type='submit'
              isLoading={isLoading}
            >
              <Send />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
