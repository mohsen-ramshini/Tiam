import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

const TASK_ASSIGNMENTS_QUERY_KEY = ['task-assignments'];

export const useUpdateTaskAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axiosInstance.put(`/repo/task-assignments/${id}/`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(TASK_ASSIGNMENTS_QUERY_KEY);
    }
  });
};
