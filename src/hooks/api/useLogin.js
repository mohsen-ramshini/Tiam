import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const loginUser = async ({ username, password }) => {
  const response = await axiosInstance.post('users/login/', {
    login_type: 'user',
    username,
    password
  });

  // ذخیره توکن در لوکال استوریج یا کوکی (بسته به نیاز)
  localStorage.setItem('token', response.data.token);

  return response.data;
};

export function useLogin() {
  return useMutation({
    mutationFn: loginUser
  });
}
