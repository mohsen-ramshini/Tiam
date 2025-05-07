import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

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
    }
  });
};
