import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

export const useFetchHosts = () => {
  return useQuery({
    queryKey: ['all-hosts'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/repo/all-hosts/');
      return data.data;
    },
    onError: (error) => {
      console.error('خطا در دریافت میزبان‌ها:', error);
    }
  });
};
