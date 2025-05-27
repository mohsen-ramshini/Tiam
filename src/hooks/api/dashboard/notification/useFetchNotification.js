import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useFetchNotification = () => {
  return useQuery({
    queryKey: ['notification'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/repo/notification/');
      return data;
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'خطا در دریافت اعلان ها.';
        
      toast.error(message);
      console.error('خطا در دریافت اعلان ها:', error);
    }
  });
};
