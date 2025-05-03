/* eslint-disable prettier/prettier */
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance'; // مسیر رو درست کن

const fetchRecords = async () => {
  console.log('Fetching records...');
  const response = await axiosInstance.get('/repo/task-results/');
  return response.data;
};

export const useFetchRecords = () => {
  return useQuery({
    queryKey: ['records'],
    queryFn: fetchRecords,
    retry: 2,
  });
};
