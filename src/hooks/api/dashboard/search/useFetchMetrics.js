import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

export const useFetchMetrics = () => {
  return useQuery({
    queryKey: ['all-metrics'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/repo/all-metrics/');
      return data.data;
    },
    onError: (error) => {
      console.error('خطا در دریافت متریک‌ها:', error);
    }
  });
};
