import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useUpdateAssertionRole = ({ setError, setOpen }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      axiosInstance.put(`/repo/assertion-rule/${id}/`, data),

    onSuccess: () => {
      queryClient.invalidateQueries(['assertion-role']);
      setOpen(false);
      toast.success('اعلان با موفقیت ویرایش شد');
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'خطا در ویرایش اعلان. لطفاً بررسی کنید.';

      toast.error(message);
      console.error('خطا در ویرایش اعلان:', error);

      if (setError) {
        setError('api', { message });
      }
    }
  });
};
