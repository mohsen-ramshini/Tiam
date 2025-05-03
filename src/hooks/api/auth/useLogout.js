import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import axiosInstance from '../../../api/axiosInstance';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      

      const refreshToken = Cookies.get('refresh_token'); 

      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await axiosInstance.post('/users/logout/', 
        { refresh: refreshToken },  
        { withCredentials: true }
      );

      if (response.status !== 200) {
        throw new Error('Logout failed');
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      Cookies.remove('refresh_token'); 
      Cookies.remove('access_token'); 
      window.location.href = '/login';
    },
    onError: (error) => {
      console.error('Logout failed:', error.response?.data || error);
    },
  });
};
