'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  deleteOrder,
  setQuantity,
  resetOrder,
  setPayClicked,
} from '../store/slice/orderSlice';
import { useEffect, useState } from 'react';
import {
  faArrowLeftRotate,
  faCircle,
  faMinus,
  faPlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import PopUpModal from './PopUpModal';

export default function ListOrder() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orderProducts, totalAmount } = useAppSelector((state) => state.order);

  const handleQuantityChange = (name: string, value: number) =>
    dispatch(
      setQuantity({
        name: name,
        quantity: value,
      })
    );

  const onClickPay = () => {
    if (orderProducts.length === 0) {
      dispatch(setPayClicked(true));
    } else {
      router.push('/payment');
    }
  };

  return (
    <div className=" w-full bg-white drop-shadow relative">
      <p className="text-xl font-bold text-center mt-2">Daftar Pesanan</p>
      <div>
        <table className="w-full">
          <thead className="block pl-2 me-4">
            <tr className="bg-green-200 drop-shadow grid grid-cols-4">
              <th>Menu</th>
              <th>Jumlah</th>
              <th>Harga</th>
              <th>Sub Total</th>
            </tr>
          </thead>
        </table>
        <div className="w-full mt-2">
          <table className="w-full">
            <tbody
              className={`grid overflow-y-auto max-h-[500px] py-1 pl-2 border-collapse gap-y-2 ${
                orderProducts.length === 10 ? 'pr-2' : 'pr-4'
              }`}
            >
              {orderProducts?.map((item) => (
                <tr
                  key={item.product.id}
                  className="bg-white w-full hover:bg-green-400 drop-shadow rounded grid grid-cols-4 items-center text-center"
                >
                  <td className="px-1">{item.product.name}</td>
                  <td className="p-2 text-center">
                    <input
                      type="text"
                      name="quantity"
                      id="quantity"
                      value={item.quantity}
                      inputMode="numeric"
                      pattern="[1-9]"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');

                        if (value === '') return;

                        if (value === '0') return;

                        if (value.length >= 1) {
                          handleQuantityChange(item.product.name, +value);
                        }
                      }}
                      className="w-10 text-center outline-none rounded border"
                    />
                  </td>
                  <td className="p-2 text-center">Rp. {item.product.price}</td>
                  <td className="flex gap-1 justify-between pr-2 items-center">
                    <p className="xl: text-base">Rp. {item.subtotal}</p>
                    <button
                      className="bg-red-500 rounded w-5 h-5 flex justify-center items-center hover:cursor-pointer hover:bg-red-600"
                      onClick={() =>
                        dispatch(deleteOrder({ name: item.product.name }))
                      }
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orderProducts.length === 0 && (
          <p className=" italic text-gray-400 text-center">
            Daftar pesanan kosong
          </p>
        )}
      </div>

      <div className=" h-16 p-4 w-full flex justify-between items-center mt-[10px] rounded-b">
        <div className="flex justify-between gap-2">
          <p className="text-xl font-bold">Total: </p>
          <p className="text-xl font-bold">Rp. {totalAmount}</p>
        </div>
        <div className="flex gap-1">
          <button
            className="bg-green-500 hover:bg-green-600 rounded w-40 h-10"
            onClick={onClickPay}
          >
            Bayar
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 rounded w-10 h-10"
            onClick={() => dispatch(resetOrder())}
          >
            <FontAwesomeIcon icon={faArrowLeftRotate} />
          </button>
        </div>
      </div>
    </div>
  );
}
