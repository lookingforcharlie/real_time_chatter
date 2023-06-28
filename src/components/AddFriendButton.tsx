'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ZodError, set, z } from 'zod';
import { addFriendValidator } from '../lib/validations/add-friend';
import Button from './ui/Button';

interface AddFriendButtonProps {}

// turning addFriendValidator from zod into TypeScript type
type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  // telling the hook form: if the value we are trying to pass for input is not legit, it's going to handle the error state for us. It wil give a error object we can render on the page, displaying to the user why exactly this action doesn't work
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      // validate user input of email
      const validatedEmail = addFriendValidator.parse({ email });
      await axios.post('/api/friends/add', {
        email: validatedEmail,
      });
      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('email', { message: error.message });
        return;
      }
      if (error instanceof AxiosError) {
        setError('email', { message: error.response?.data });
        return;
      }
      setError('email', { message: 'Something went wrong.' });
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <form className='max-w-sm' onSubmit={handleSubmit(onSubmit)}>
      <label
        htmlFor='email'
        className='block text-sm font-medium leading-6 text-gray-900'
      >
        Add friend by E-Mail
      </label>

      <div className='flex mt-2 gap-4'>
        <input
          {...register('email')} // from react hook form
          type='text'
          placeholder='you@example.com'
          className='block border-0 w-full rounded-md py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        />
        <Button>Add</Button>
      </div>
      <p className='mt-1 text-sm text-red-600'>{errors.email?.message}</p>
      {showSuccessState ? (
        <p className='mt-1 text-sm text-green-600'>Friend request sent!</p>
      ) : null}
    </form>
  );
};

export default AddFriendButton;

// Handle user input
