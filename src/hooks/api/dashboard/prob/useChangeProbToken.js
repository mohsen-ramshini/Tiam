/* eslint-disable prettier/prettier */
// hooks/api/dashboard/prob/useChangeProbToken.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useChangeProbToken = ({ setError, reset, setOpen, onSuccessCallback }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) =>
      axiosInstance.put(`/users/change-prob-token/${id}/`),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['probes'] });

      const token = response?.data?.token;
      toast.success('توکن با موفقیت دریافت شد');

      if (onSuccessCallback && token) {
        onSuccessCallback(token);
      }

      reset?.();
      setOpen?.(false);
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'خطا در دریافت توکن. لطفاً دوباره تلاش کنید.';

      toast.error(message);
      console.error('خطا در دریافت توکن:', error);

      if (setError) {
        setError('api', { message });
      }
    },
  });
};
