import { axiosClient } from '../axiosClient';

type RequestProps = {
  totalAmount: number;
  totalPay: number;
  orderProducts: {
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

const transactionApi = {
  create(data: RequestProps) {
    return axiosClient.post('/transaction/add', data);
  },
};

export default transactionApi;
