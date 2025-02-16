'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from './component/Loading';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/order');
  });

  return <Loading />;
}
