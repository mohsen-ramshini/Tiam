import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axiosInstance from 'api/axiosInstance';

const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post('/repo/tasks/', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('تسک با موفقیت اضافه شد!');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: (error) => {
      toast.error('خطا در ایجاد تسک');
      console.error('Create task error:', error);
    }
  });
};

export default useCreateTask;
