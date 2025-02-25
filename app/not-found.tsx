'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Notfound() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-white flex flex-col gap-4 justify-center items-center z-50">
      <span className="text-red-500 font-bold text-9xl">404</span>
      <span className="text-4xl font-bold">HALAMAN TIDAK DITEMUKAN</span>
      <button
        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
        onClick={() => router.push('/order')}
      >
        Kembali ke Order
      </button>
    </div>
  );
}
