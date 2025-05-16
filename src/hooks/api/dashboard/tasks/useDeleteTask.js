import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axiosInstance from 'api/axiosInstance';

const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/repo/tasks/${id}/`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('تسک با موفقیت حذف شد!');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: (error) => {
      toast.error('خطا در حذف تسک');
      console.error('Delete task error:', error);
    }
  });
};

export default useDeleteTask;
