import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'api/axiosInstance';

export const useFetchServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/repo/services/');
      return data;
    },
    onError: (error) => {
      console.error('خطا در دریافت سرویس‌ها:', error);
    }
  });
};
