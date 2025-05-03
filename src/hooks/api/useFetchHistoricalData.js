import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const fetchHistoricalData = async ({ queryKey }) => {
  const [_key, { start, end, probs, group_by, func }] = queryKey;

  const response = await axiosInstance.get('/repo/data/3/test/', {
    params: {
      start,
      end,
      probs,
      group_by,
      func,
    },
  });

  console.log('Fetched historical data:', response.data);
  return response.data;
};

const useFetchHistoricalData = ({ start, end, probs, group_by, func }) => {
  return useQuery({
    queryKey: ['historical-data', { start, end, probs, group_by, func }],
    queryFn: fetchHistoricalData,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export default useFetchHistoricalData;
