import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

const TASK_ASSIGNMENTS_QUERY_KEY = ['task-assignments'];

export const useFetchTaskAssignment = () => {
  return useQuery({
    queryKey: TASK_ASSIGNMENTS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axiosInstance.get('/repo/task-assignments/');
      return data;
    }
  });
};
