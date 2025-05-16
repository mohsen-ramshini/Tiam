import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

export const useSearch = ({ host, metric }) => {
  return useQuery({
    queryKey: ['search-metrics', host, metric],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/repo/search/', {
        params: { host, metric }
      });
      return data;
    },
    enabled: !!host && !!metric,
    onError: (error) => {
      console.error('خطا در جستجوی متریک‌ها:', error);
    }
  });
};
