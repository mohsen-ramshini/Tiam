import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useFetchProbes = () => {
  return useQuery({
    queryKey: ['probes'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/users/probs/');
      return data;
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'خطا در دریافت پراب‌ها.';
        
      toast.error(message);
      console.error('خطا در دریافت پراب‌ها:', error);
    }
  });
};
