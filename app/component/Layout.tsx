'use client';

import React, { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAsterisk,
  faBars,
  faBowlFood,
  faCalendar,
  faShapes,
  faShoppingBasket,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  const header = useAppSelector((state) => state.header);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <header className="w-full h-14 bg-green-400 p-2 flex justify-center items-center relative">
        <div
          className={`fixed left-0 h-full flex justify-center items-center border-b hover:bg-green-600 transition-all duration-300 ease-in-out will-change-transform overflow-hidden ${
            isExpanded ? 'w-40 pl-[18px]' : 'w-14 justify-center'
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FontAwesomeIcon
            icon={faBars}
            size="xl"
            className="fixed left-[18px]"
          />

          <p
            className={`absolute left-14 font-bold transition-all opacity-0 ${
              isExpanded ? 'animate-appear' : 'opacity-100'
            }`}
          >
            Menu
          </p>
        </div>
        <p className="text-xl font-bold text-green-950">{header.title}</p>
      </header>
      <div className="flex">
        <div
          className={`flex flex-col h-screen p-2 gap-4 border-t border-t-white bg-green-400 z-10 fixed transition-all duration-300 ease-in-out will-change-transform overflow-hidden ${
            isExpanded ? 'w-40' : 'w-14'
          }`}
        >
          <Link
            className="flex items-center rounded hover:bg-green-600 relative p-2"
            href="/order"
          >
            <FontAwesomeIcon
              icon={faShoppingBasket}
              size="lg"
              className="absolute ml-0.5"
            />
            <p
              className={`ml-10 transition-all  ${
                isExpanded ? 'animate-appear' : 'animate-dissapear'
              }`}
            >
              Pesanan
            </p>
          </Link>
          <Link
            className="flex items-center rounded hover:bg-green-600 relative p-2"
            href="/transaction"
          >
            <FontAwesomeIcon
              icon={faCalendar}
              size="lg"
              className="absolute ml-0.5"
            />
            <p
              className={`ml-10 transition-all  ${
                isExpanded ? 'animate-appear' : 'animate-dissapear'
              }`}
            >
              Transaksi
            </p>
          </Link>
          <Link
            className="flex items-center rounded hover:bg-green-600 relative p-2"
            href="/edit/category"
          >
            <FontAwesomeIcon
              icon={faShapes}
              size="lg"
              className="absolute ml-0.5"
            />
            <FontAwesomeIcon
              icon={faAsterisk}
              size="xs"
              className="absolute top-0.5 left-7"
            />
            <p
              className={`ml-10 transition-all  ${
                isExpanded ? 'animate-appear' : 'animate-dissapear'
              }`}
            >
              Kategori
            </p>
          </Link>
          <Link
            className="flex items-center rounded hover:bg-green-600 relative p-2"
            href="/edit/menu"
          >
            <FontAwesomeIcon
              icon={faBowlFood}
              size="lg"
              className="absolute ml-0.5"
            />
            <FontAwesomeIcon
              icon={faAsterisk}
              size="xs"
              className="absolute top-0.5 left-7"
            />
            <p
              className={`ml-10 transition-all  ${
                isExpanded ? 'animate-appear' : 'animate-dissapear'
              }`}
            >
              Produk
            </p>
          </Link>
        </div>
        <div className="pl-14 w-full">{children}</div>
      </div>
    </div>
  );
}
