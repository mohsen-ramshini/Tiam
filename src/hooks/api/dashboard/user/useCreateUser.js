import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

const addUser = async (data) => {
  const response = await axiosInstance.post('/users/users/', data);
  return response.data;
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['usersList']); 
    },
  });
};
