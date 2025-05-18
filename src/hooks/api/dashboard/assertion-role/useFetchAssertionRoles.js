import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useFetchAssertionRole = () => {
  return useQuery({
    queryKey: ['assertion-role'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/repo/assertion-rule/');
      return data;
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'خطا در دریافت اعلان.';
        
      toast.error(message);
      console.error('خطا در دریافت اعلان:', error);
    }
  });
};
