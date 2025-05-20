// src/hooks/api/dashboard/user/useDeleteUser.js

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axiosInstance from 'api/axiosInstance';

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/users/users/${id}/`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('کاربر با موفقیت حذف شد!');
      queryClient.invalidateQueries(['users']); 
    },
    onError: (error) => {
      toast.error('خطا در حذف کاربر');
      console.error('Delete user error:', error);
    },
  });
};

export default useDeleteUser;
