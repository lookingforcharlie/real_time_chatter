// In Next.JS, this is what next.js falls back to when the component is loading
//
import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div className='w-full flex flex-col gap-3 mt-22'>
      <Skeleton className='mb-4' height={60} width={500} />
      <Skeleton height={50} width={350} />
      <Skeleton height={50} width={350} />
      <Skeleton height={50} width={350} />
    </div>
  );
};

export default loading;
