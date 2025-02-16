import useSWR from 'swr';
import { getData } from '../axiosClient';

type Param = {
  id?: number;
  sortBy?: string;
  sortOrder?: string;
  name?: string;
  categoryId?: number;
};

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  category: {
    id: number;
    name: string;
    totalRelatedProducts: number;
  };
};

const useProducts = (param: Param) => {
  if (param.id) {
    const { data, error, mutate } = useSWR<Product>(
      `/product/${param.id}`,
      getData<Product>
    );

    return {
      product: data,
      error: error,
      isLoading: !data && !error,
      mutate,
    };
  } else {
    const query = new URLSearchParams();

    if (param.sortBy) query.append('sort_by', param.sortBy);
    if (param.sortOrder) query.append('sort_order', param.sortOrder);
    if (param.categoryId)
      query.append('category_id', param.categoryId.toString());
    if (param.name) query.append('name', param.name);

    const { data, error, mutate } = useSWR<Product[]>(
      `/product/all?${query.toString()}`,
      getData<Product[]>
    );

    return {
      products: data,
      error: error,
      isLoading: !data && !error,
      mutate,
    };
  }
};

export default useProducts;
