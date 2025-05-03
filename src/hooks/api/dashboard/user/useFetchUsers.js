import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

const fetchUsers = async () => {
  const response = await axiosInstance.get('/users/users/');
  return response.data;
};

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ['usersList'],
    queryFn: fetchUsers,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
};
