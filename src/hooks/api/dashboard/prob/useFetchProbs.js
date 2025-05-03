import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

export const useFetchProbes = () => {
    return useQuery({
      queryKey: ['probes'],
      queryFn: async () => {
        const { data } = await axiosInstance.get('/users/probs/');
        return data;
      },
      onError: (error) => {
        console.error('خطا در دریافت پراب‌ها:', error);
      }
    });
  };
  