import useSWR from 'swr';
import { getData } from '../axiosClient';

type Category = {
  id: number;
  name: string;
  totalRelatedProducts: number;
};

const useCategory = () => {
  const { data, error, mutate } = useSWR<Category[]>(
    `/category/all`,
    getData<Category[]>
  );

  return {
    categories: data,
    error: error,
    isLoading: !data && !error,
    mutate,
  };
};

export default useCategory;
