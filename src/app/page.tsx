import Image from 'next/image';
import Link from 'next/link';
import Button from '../components/ui/Button';
import { redis } from '../lib/db';

export default async function Home() {
  await redis.set('find', 'a job');
  return (
    <div>
      <div className='text-red-500'>I am the homepage</div>
      <Button size='lg' variant='default'>
        Click you
      </Button>
      <Link href='/login'>Go to Login Page</Link>
    </div>
  );
}
