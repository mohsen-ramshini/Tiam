import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'api/axiosInstance';
import { toast } from 'sonner';

export const useFetchServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/repo/services/');
      return data.results;
    },
    onError: (error) => {
      console.error('خطا در دریافت سرویس‌ها:', error);
      toast.error('خطا در دریافت سرویس‌ها. لطفاً دوباره تلاش کنید.');
    }
  });
};
