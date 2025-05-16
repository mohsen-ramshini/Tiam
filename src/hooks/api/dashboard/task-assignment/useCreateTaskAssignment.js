import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

const TASK_ASSIGNMENTS_QUERY_KEY = ['task-assignments'];

export const useCreateTaskAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post('/repo/task-assignments/', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(TASK_ASSIGNMENTS_QUERY_KEY);
      toast.success('تخصیص تسک با موفقیت انجام شد!');
    },
    onError: (error) => {
      console.error('خطا در ایجاد تخصیص تسک:', error);
      toast.error('خطا در ایجاد تخصیص تسک. لطفاً دوباره تلاش کنید.');
    }
  });
};
