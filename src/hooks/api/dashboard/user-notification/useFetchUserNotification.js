import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useFetchUserNotification = () => {
  return useQuery({
    queryKey: ['user-notification'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/repo/user-notification/');
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
