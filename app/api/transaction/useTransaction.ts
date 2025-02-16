import useSWR from 'swr';
import { getData } from '../axiosClient';

type Transaction = {
  id: number;
  totalAmount: number;
  totalPay: number;
  createdAt: string;
  transactionProducts: {
    id: number;
    quantity: number;
    subtotal: number;
    product: {
      id: number;
      image: string;
      name: string;
      price: number;
    };
  }[];
};

const useTransaction = () => {
  const { data, error, mutate } = useSWR<Transaction[]>(
    `/transaction/all`,
    getData<Transaction[]>
  );

  return {
    transactions: data,
    error: error,
    isLoading: !data && !error,
    mutate,
  };
};

export default useTransaction;
