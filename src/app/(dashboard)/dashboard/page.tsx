import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FC } from 'react';
import { authOptions } from '../../../lib/auth';

const page = async () => {
  // get the session
  const session = await getServerSession(authOptions);
  // we got the session that contains id, name, email, and image
  // Now we can verify the session throughout the entire app
  console.log('--------------------');
  console.log('Next auth session got from dashboard page.tsx:', session);
  console.log('--------------------');

  return (
    // <div className='flex flex-col gap-6'>
    //   <h1 className='text-4xl'>Dashboard</h1>
    //   <div>You are logged in successfully</div>;
    //   <Link
    //     href='/dashboard/add'
    //     className='border border-orange-500 px-4 py-2'
    //   >
    //     Go to add friend
    //   </Link>
    // <pre>{JSON.stringify(session)}</pre>
    // </div>
    <div>Dashboard</div>
  );
};

export default page;

// this is how session looks like
// {"user":{"name":"Bino Feng","email":"bino.feng@gmail.com","image":"https://lh3.googleusercontent.com/a/AAcHTtcaHUWMAbGjtx-V98U36E3lC2ngdUa40XW1TwB-=s96-c","id":"6543b13d-021c-43fc-835b-be014c98dc2c"}}
