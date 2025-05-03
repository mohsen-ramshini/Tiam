import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'api/axiosInstance';

const useDeleteTask = ({ onSuccessCallback, onErrorCallback }) => {
  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/repo/tasks/${id}/`);
      return res.data;
    },
    onSuccess: onSuccessCallback,
    onError: onErrorCallback
  });
};

export default useDeleteTask;
