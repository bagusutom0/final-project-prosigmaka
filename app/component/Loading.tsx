import React from 'react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="border-solid border-8 border-t-gray-500 w-20 h-20 rounded-full animate-spin ease-linear"></div>
    </div>
  );
}
