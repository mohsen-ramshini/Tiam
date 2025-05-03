import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'api/axiosInstance';

const useUpdateTask = ({ onSuccessCallback, onErrorCallback }) => {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosInstance.put(`/repo/tasks/${id}/`, data);
      return res.data;
    },
    onSuccess: onSuccessCallback,
    onError: onErrorCallback
  });
};

export default useUpdateTask;
