'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useRouter } from 'next/navigation';
import transactionApi from '../api/transaction/transactionApi';
import { setTitle } from '../store/slice/headerSlice';
import { resetOrder } from '../store/slice/orderSlice';
import PaymentModal from '../component/PaymentModal';
import PopUpModal from '../component/PopUpModal';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Payment() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orderProducts, totalAmount } = useAppSelector((state) => state.order);
  const [totalPay, setTotalPay] = useState('');
  const [totalRefund, setTotalRefund] = useState(0);
  const [canPay, setCanPay] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTotalPay = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setTotalPay(value);

    if (+value >= totalAmount) {
      setCanPay(true);
      setTotalRefund((totalAmount - +value) * -1);
    } else {
      setCanPay(false);
      setTotalRefund(0);
    }
  };

  const handlePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const onModalClose = () => {
    transactionApi.create({
      totalAmount: totalAmount,
      totalPay: +totalPay,
      orderProducts: orderProducts,
    });
    setIsModalOpen(false);
    dispatch(resetOrder());
    router.push('/order');
  };

  useEffect(() => {
    dispatch(setTitle('Pembayaran'));
  }, []);

  return (
    <div className="w-full">
      <main className="w-full grid grid-cols-3 p-2 gap-2">
        <div className="col-span-2 max-h-[700px] overflow-y-auto p-1">
          <table className="w-full mt-2">
            <thead className="block pl-2 me-4">
              <tr className="bg-green-200 drop-shadow grid grid-cols-4 md:text-xs lg:text-sm xl:text-base">
                <th className="col-span-2">Menu</th>
                <th>Jumlah</th>
                <th>Sub total</th>
              </tr>
            </thead>
          </table>
          <div className="w-full mt-2">
            <table className="w-full">
              <tbody
                className={`grid overflow-y-auto md:max-h-[530px] lg:max-h-[525px] xl:max-h-[520px] 2xl:max-h-[605px] py-1 pl-2 border-collapse gap-y-2 ${
                  orderProducts?.length === 9
                    ? 'md:pr-2'
                    : orderProducts?.length === 8
                    ? 'lg:pr-2 2xl:pr-2'
                    : orderProducts?.length === 7
                    ? 'xl:pr-2'
                    : 'pr-4'
                }`}
              >
                {orderProducts?.map((item) => (
                  <tr
                    key={item.product.id}
                    className="bg-white w-full hover:bg-green-400 drop-shadow rounded grid grid-cols-4 items-center text-center "
                  >
                    <td className="p-2 flex items-center gap-4 col-span-2">
                      <img
                        className="md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14"
                        src={item.product.image}
                        alt={item.product.name}
                      />
                      <p>{item.product.name}</p>
                    </td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-center">Rp. {item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <form
          onSubmit={handlePayment}
          className="h-56 bg-white drop-shadow rounded py-2 px-4 mt-3 text-center md:text-xs lg:text-sm xl:text-base"
        >
          <p className="md:text-xs lg:text-sm xl:text-xl font-bold text-center">
            Detail Pembayaran
          </p>
          <hr />
          <div className="flex justify-between items-center">
            <p className="mt-4">Total Harga:</p>
            <p>Rp. {totalAmount}</p>
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="totalPay">Total Bayar: </label>
            <input
              type="text"
              name="totalPay"
              id="totalPay"
              value={totalPay}
              className="border p-1 md:w-20 lg:w-32 xl:w-44"
              pattern="\d*"
              inputMode="numeric"
              onChange={handleTotalPay}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <p>Total Kembalian:</p>
            <p>Rp. {totalRefund}</p>
          </div>
          <button
            className={`p-2 mt-6 px-10 rounded ${
              canPay
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-green-200 text-gray-500'
            }`}
            disabled={!canPay}
            type="submit"
          >
            Bayar
          </button>
        </form>
      </main>
      <PopUpModal isOpen={isModalOpen} onClose={onModalClose}>
        <p>
          Pembayaran Berhasil <FontAwesomeIcon icon={faCircleCheck} />
        </p>
      </PopUpModal>
    </div>
  );
}
