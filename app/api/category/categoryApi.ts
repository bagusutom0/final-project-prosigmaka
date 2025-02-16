import { axiosClient } from '../axiosClient';

type RequestProps = {
  id?: number;
  name?: string;
};

const categoryApi = {
  create(data: RequestProps) {
    return axiosClient.post('/category/add', data);
  },
  update(data: RequestProps) {
    return axiosClient.put(`/category/update/${data.id}`, { name: data.name });
  },
  delete(data: RequestProps) {
    return axiosClient.delete(`/category/delete/${data.id}`);
  },
};

export default categoryApi;
