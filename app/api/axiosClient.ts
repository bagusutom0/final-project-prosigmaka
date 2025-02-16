import axios from 'axios';

const baseUrl = 'http://localhost:8080/api/v1';

const axiosClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getData = <T>(url: string): Promise<T> => {
  return axiosClient.get<T>(url).then((res) => res.data);
};

export { axiosClient, getData };
