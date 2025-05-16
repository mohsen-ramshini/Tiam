import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

const fetchUsers = async () => {
  const response = await axiosInstance.get('/users/users/');
  return response.data.results;
};

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ['usersList'],
    queryFn: fetchUsers,
    retry: 2, // تلاش مجدد تا دو بار در صورت خطا
    staleTime: 1000 * 60 * 5, // داده‌ها به مدت 5 دقیقه تازه در نظر گرفته می‌شن
    onError: (error) => {
      toast.error('خطا در دریافت لیست کاربران');
      console.error('Fetch users error:', error);
    }
  });
};
