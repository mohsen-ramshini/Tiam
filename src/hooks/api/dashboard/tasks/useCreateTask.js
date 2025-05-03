import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'api/axiosInstance';

const useCreateTask = ({ onSuccessCallback, onErrorCallback }) => {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post('/repo/tasks/', payload);
      return data;
    },
    onSuccess: onSuccessCallback,
    onError: onErrorCallback
  });
};

export default useCreateTask;
