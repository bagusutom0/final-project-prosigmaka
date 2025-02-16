import { axiosClient } from '../axiosClient';

type RequestProps = {
  id?: number;
  name?: string;
  image?: string;
  price?: number;
  categoryId?: number;
};

const productApi = {
  create(data: RequestProps) {
    return axiosClient.post('/product/add', data);
  },
  update(data: RequestProps) {
    return axiosClient.put(`/product/update/${data.id}`, {
      name: data.name,
      image: data.image,
      price: data.price,
      categoryId: data.categoryId,
    });
  },
  delete(data: RequestProps) {
    return axiosClient.delete(`/product/delete/${data.id}`);
  },
};

export default productApi;
