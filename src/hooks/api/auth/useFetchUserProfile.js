import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchUserProfile = async (accessToken) => {
  if (!accessToken) throw new Error('No access token provided');

  const response = await axios.get('/users/profile/', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.data;
};

export const useFetchUserProfile = (accessToken) => {
  return useQuery({
    queryKey: ['userProfile', accessToken],
    queryFn: () => fetchUserProfile(accessToken),
    enabled: !!accessToken,
    retry: 2
  });
};
