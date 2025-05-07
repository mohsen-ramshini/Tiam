import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

const TASK_ASSIGNMENTS_QUERY_KEY = ['task-assignments'];

export const useDeleteTaskAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/repo/task-assignments/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(TASK_ASSIGNMENTS_QUERY_KEY);
    }
  });
};
