'use client';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTitle } from '../store/slice/headerSlice';
import useTransaction from '../api/transaction/useTransaction';
import { useEffect, useRef, useState } from 'react';
import TransactionModal from '../component/TransactionModal';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type TransactionProduct = {
  id: number;
  quantity: number;
  subtotal: number;
  product: {
    id: number;
    image: string;
    name: string;
    price: number;
  };
};

type Transaction = {
  id: number;
  totalAmount: number;
  totalPay: number;
  createdAt: string;
  transactionProducts: TransactionProduct[];
};

export default function Transaction() {
  const dispatch = useAppDispatch();
  const { transactions } = useTransaction();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState(0);
  const [totalPay, setTotalPay] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [createdAt, setCreatedAt] = useState('');
  const [transactionProducts, setTransactionProducts] = useState<
    TransactionProduct[]
  >([]);

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const onDetailClick = (transaction: Transaction) => {
    setTransactionId(transaction.id);
    setTotalAmount(transaction.totalAmount);
    setTotalPay(transaction.totalPay);
    setCreatedAt(transaction.createdAt);
    setTransactionProducts(transaction.transactionProducts);
    setIsModalOpen(true);
  };

  useEffect(() => {
    dispatch(setTitle('Riwayat Transaksi'));
  }, []);

  return (
    <>
      <div>
        <table className="w-full border-separate border-spacing-y-0 px-2 pt-2">
          <thead>
            <tr className="bg-green-200 pt-4 drop-shadow">
              <th className="w-1/5">Id</th>
              <th className="w-1/5">Total Harga</th>
              <th className="w-1/5">Total Bayar</th>
              <th className="w-1/5">Tanggal</th>
              <th className="w-1/5">Action</th>
            </tr>
          </thead>
        </table>

        <div className="overflow-y-auto max-h-[638px] px-2">
          <table className="border-separate border-spacing-y-2 w-full">
            <tbody>
              {transactions?.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="bg-white hover:bg-green-400 hover:rounded drop-shadow"
                >
                  <td className="p-2 text-center w-1/5">{transaction.id}</td>
                  <td className="p-2 text-center w-1/5">
                    Rp. {transaction.totalAmount}
                  </td>
                  <td className="p-2 text-center w-1/5">
                    Rp. {transaction.totalPay}
                  </td>
                  <td className="p-2 text-center w-1/5">
                    {transaction.createdAt}
                  </td>
                  <td className="flex justify-center items-center mt-0.5">
                    <button
                      onClick={() => onDetailClick(transaction)}
                      className="px-4 py-1 bg-green-500 hover:bg-green-600 rounded"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions?.length === 0 && (
          <p className=" italic text-gray-400 text-center">
            Daftar transaksi kosong
          </p>
        )}
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={onCloseModal}>
        <div className="w-full h-32 p-4 mt-4 bg-white drop-shadow rounded">
          <div className="flex justify-between items-center">
            <p>Id Transaksi</p>
            <p>{transactionId}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Total Harga</p>
            <p>{totalAmount}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Total Bayar</p>
            <p>{totalPay}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Tanggal</p>
            <p>{createdAt}</p>
          </div>
        </div>
        <table className="w-full border-separate border-spacing-y-2 mt-2">
          <thead>
            <tr className="bg-green-200 drop-shadow">
              <th>Menu</th>
              <th>Jumlah</th>
              <th>Harga</th>
              <th>Sub Total</th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto max-h-48">
            {transactionProducts.map((transaction) => (
              <tr
                key={transaction.product.name}
                className="bg-white hover:bg-green-400 hover:rounded drop-shadow"
              >
                <td className="p-2">{transaction.product.name}</td>
                <td className="p-2 text-center">{transaction.quantity}</td>
                <td className="p-2 text-center">
                  Rp. {transaction.product.price}
                </td>
                <td className="relative">Rp. {transaction.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TransactionModal>
    </>
  );
}
