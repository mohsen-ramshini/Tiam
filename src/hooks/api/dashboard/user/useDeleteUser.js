import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return new Promise((resolve, reject) => {
        toast.warning('آیا از حذف این کاربر مطمئن هستید؟', {
          action: {
            label: 'حذف کن',
            onClick: async () => {
              try {
                await axiosInstance.delete(`/users/users/${id}/`);
                resolve(); // ادامه‌ی فرآیند حذف
              } catch (err) {
                reject(err); // خطا در حذف از سرور
              }
            }
          },
          cancel: {
            label: 'لغو',
            onClick: () => reject(new Error('عملیات حذف لغو شد'))
          },
          duration: 8000
        });
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries(['usersList']);
      toast.success('کاربر با موفقیت حذف شد');
    },

    onError: (error) => {
      if (error.message !== 'عملیات حذف لغو شد') {
        toast.error('خطا در حذف کاربر');
        console.error(error);
      }
    }
  });
};
