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

  return <div>Dashboard</div>;
};

export default page;

// this is how session looks like
// {"user":{"name":"Bino Feng","email":"bino.feng@gmail.com","image":"https://lh3.googleusercontent.com/a/AAcHTtcaHUWfewaYBGHHYAbGaefaadsfas3lC2ngdUa4B-=s96-c","id":"6543b13d-adsefawef-wefe--be014c98dc2c"}}
