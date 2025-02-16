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
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-green-200 drop-shadow">
                <th>Menu</th>
                <th>Jumlah</th>
                <th>Sub total</th>
              </tr>
            </thead>
            <tbody>
              {orderProducts?.map((item) => (
                <tr
                  key={item.product.id}
                  className="bg-white hover:bg-green-400 hover:rounded drop-shadow"
                >
                  <td className="p-2 flex items-center gap-4">
                    <img
                      className="w-14 h-14"
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
        <form
          onSubmit={handlePayment}
          className="h-58 bg-white drop-shadow rounded py-2 px-4 mt-3 text-center"
        >
          <p className="text-xl font-bold text-center">Detail Pembayaran</p>
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
              className="border p-1"
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
