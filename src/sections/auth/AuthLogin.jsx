import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// hooks
import { useLogin } from 'hooks/api/useLogin';
import { useFetchUserProfile } from 'hooks/api/useFetchUserProfile';
import { useUser } from 'contexts/UserContext';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function AuthLogin({ isDemo = false }) {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [accessToken, setAccessToken] = useState(Cookies.get('access_token') || null);
  const loginMutation = useLogin();

  // Fetch user profile only when accessToken is available
  const { data: userProfile, refetch: refetchUserProfile } = useFetchUserProfile(accessToken);

  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
      navigate('/');
    }
  }, [userProfile, setUser, navigate]);

  const handleLoginSubmit = (values, { setSubmitting, setErrors }) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        Cookies.set('access_token', data.access, { expires: 1, secure: true, sameSite: 'Strict' });
        Cookies.set('refresh_token', data.refresh, { expires: 7, secure: true, sameSite: 'Strict' });
        setAccessToken(data.access);
        console.log('🔹 Access token received:', data.access);
        refetchUserProfile();
      },
      onError: (error) => {
        setErrors({ submit: error.response?.data?.message || 'Login failed!' });
      },
      onSettled: () => setSubmitting(false)
    });
  };

  return (
    <Formik
      initialValues={{ username: 'tiam-front-1', password: 'asdf1234' }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string()
          .required('Password is required')
          .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
          .max(10, 'Password must be less than 10 characters')
      })}
      onSubmit={handleLoginSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, touched, values, isSubmitting }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="username-login">نام کاربری</InputLabel>
                <OutlinedInput
                  id="username-login"
                  type="text"
                  value={values.username}
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter username"
                  fullWidth
                  error={Boolean(touched.username && errors.username)}
                />
              </Stack>
              {touched.username && errors.username && <FormHelperText error>{errors.username}</FormHelperText>}
            </Grid>
            <Grid item xs={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="password-login">گذرواژه</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter password"
                />
              </Stack>
              {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </Grid>
            <Grid item xs={12}>
              {errors.submit && <FormHelperText error>{errors.submit}</FormHelperText>}
              <AnimateButton>
                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loginMutation.isLoading}
                >
                  {loginMutation.isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
