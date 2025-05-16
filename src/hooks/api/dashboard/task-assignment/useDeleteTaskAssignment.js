import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

const TASK_ASSIGNMENTS_QUERY_KEY = ['task-assignments'];

export const useDeleteTaskAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/repo/task-assignments/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(TASK_ASSIGNMENTS_QUERY_KEY);
      toast.success('تخصیص تسک با موفقیت حذف شد!');
    },
    onError: (error) => {
      console.error('خطا در حذف تخصیص تسک:', error);
      toast.error('خطا در حذف تخصیص تسک. لطفاً دوباره تلاش کنید.');
    }
  });
};
