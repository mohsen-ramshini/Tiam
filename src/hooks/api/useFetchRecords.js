/* eslint-disable prettier/prettier */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchRecords = async (accessToken) => {
  console.log('Fetching records with token:', accessToken);

  const response = await axios.get('/api/repo/records/', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
};

export const useFetchRecords = (accessToken) => {
  console.log('useFetchRecords called with token:', accessToken);

  return useQuery({
    queryKey: ['records', accessToken],
    queryFn: accessToken ? () => fetchRecords(accessToken) : null,
    enabled: !!accessToken,
    retry: 2
  });
};
