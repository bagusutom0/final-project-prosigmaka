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
      <p className="md:text-sm lg:text-base xl:text-xl font-bold text-center mt-2">
        Daftar Pesanan
      </p>
      <div>
        <table className="w-full">
          <thead className="block pl-2 me-4">
            <tr className="bg-green-200 drop-shadow grid md:grid-cols-3 xl:grid-cols-4 md:text-xs lg:text-sm xl:text-base">
              <th>Menu</th>
              <th>Jumlah</th>
              <th className="md:hidden xl:block">Harga</th>
              <th>Sub Total</th>
            </tr>
          </thead>
        </table>
        <div className="w-full mt-2">
          <table className="w-full">
            <tbody
              className={`grid overflow-y-auto md:max-h-[440px] lg:max-h-[435px] xl:max-h-[425px] 2xl:max-h-[505px] py-1 pl-2 border-collapse gap-y-2 ${
                orderProducts.length === 11
                  ? 'md:pr-2'
                  : orderProducts.length === 10
                  ? '2xl:pr-2'
                  : 'pr-4'
              }`}
            >
              {orderProducts?.map((item) => (
                <tr
                  key={item.product.id}
                  className="bg-white w-full hover:bg-green-400 drop-shadow rounded grid md:grid-cols-3 xl:grid-cols-4 items-center text-center "
                >
                  <td className="px-1 md:text-xs xl:text-base">
                    {item.product.name}
                  </td>
                  <td className="p-2 text-center md:text-xs xl:text-base">
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
                      className="w-10 md:text-xs md:w-7 xl:text-base text-center outline-none rounded border"
                    />
                  </td>
                  <td className="p-2 text-center md:hidden xl:block">
                    Rp. {item.product.price}
                  </td>
                  <td className="flex gap-1 justify-between pr-2 items-center md:text-xs xl:text-base">
                    <p className="text-base md:text-xs xl:text-base md:text-center">
                      Rp. {item.subtotal}
                    </p>
                    <button
                      className="bg-red-500 rounded md:w-4 md:h-4 xl:w-5 xl:h-5 flex justify-center items-center hover:cursor-pointer hover:bg-red-600"
                      onClick={() =>
                        dispatch(deleteOrder({ name: item.product.name }))
                      }
                    >
                      <FontAwesomeIcon icon={faXmark} size="xs" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orderProducts.length === 0 && (
          <p className="md:text-xs xl:text-base italic text-gray-400 text-center">
            Daftar pesanan kosong
          </p>
        )}
      </div>

      <div className=" h-16 p-4 xl:w-full flex md:flex-col xl:flex-row md:items-start xl:justify-between xl:items-center mt-[10px] rounded-b">
        <div className="flex xl:justify-between gap-2 ">
          <p className="md:text-xs lg:text-sm xl:text-base text-xl font-bold">
            Total:{' '}
          </p>
          <p className="md:text-xs lg:text-sm xl:text-base text-xl font-bold">
            Rp. {totalAmount}
          </p>
        </div>
        <div className="flex gap-1 md:justify-between xl:justify-normal  md:w-full xl:w-auto">
          <button
            className="bg-green-500 hover:bg-green-600 rounded md:text-xs lg:text-sm xl:text-base md:w-40 lg:w-60 md:h-6 xl:w-40 xl:h-10"
            onClick={onClickPay}
          >
            Bayar
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 rounded md:text-xs md:w-6 md:h-6 xl:w-10 xl:h-10"
            onClick={() => dispatch(resetOrder())}
          >
            <FontAwesomeIcon icon={faArrowLeftRotate} />
          </button>
        </div>
      </div>
    </div>
  );
}
