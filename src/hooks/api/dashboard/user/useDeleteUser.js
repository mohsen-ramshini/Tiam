import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const confirmDelete = window.confirm('آیا از حذف این کاربر مطمئن هستید؟');
      if (!confirmDelete) throw new Error('عملیات حذف لغو شد');
      
      await axiosInstance.delete(`/users/users/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['usersList']);
      alert('کاربر با موفقیت حذف شد');
    },
    onError: (error) => {
      if (error.message !== 'عملیات حذف لغو شد') {
        alert('خطا در حذف کاربر');
      }
    }
  });
};
