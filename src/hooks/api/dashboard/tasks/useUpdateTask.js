import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axiosInstance from 'api/axiosInstance';

const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosInstance.put(`/repo/tasks/${id}/`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('تسک با موفقیت ویرایش شد!');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: () => {
      toast.error('خطا در ویرایش تسک');
    }
  });
};

export default useUpdateTask;
