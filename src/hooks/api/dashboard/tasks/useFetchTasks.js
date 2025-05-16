import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'api/axiosInstance';

const useFetchTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/repo/tasks/');
      return data.results;
    }
  });
};

export default useFetchTasks;
