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
import { useLogin } from '../../hooks/api/auth/useLogin';
import { useFetchUserProfile } from '../../hooks/api/auth/useFetchUserProfile'; 
import { useUser } from 'contexts/UserContext';
import { toast } from 'sonner';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function AuthLogin({ isDemo = false }) {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [accessToken, setAccessToken] = useState(Cookies.get('access_token') || null);
  const loginMutation = useLogin();

  // دریافت پروفایل کاربر فقط در صورت وجود توکن
  const { data: userProfile, refetch: refetchUserProfile } = useFetchUserProfile(accessToken);

  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
      navigate('/');
    }
  }, [userProfile, setUser, navigate]);

  const handleLoginSubmit = (values, { setSubmitting, setErrors }) => {
    loginMutation.mutate(values, {
      onSettled: () => {
        setSubmitting(false);
      }
    });
  };

  return (
    <Formik
      initialValues={{ username: 'admin', password: 'admin' }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required('نام کاربری الزامی است'),
        password: Yup.string()
          .required('گذرواژه الزامی است')
          .test('no-leading-trailing-whitespace', 'گذرواژه نباید با فاصله شروع یا تمام شود', (value) => value === value.trim())
          .max(10, 'گذرواژه باید کمتر از ۱۰ کاراکتر باشد')
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
                  placeholder="نام کاربری خود را وارد کنید"
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
                        aria-label="نمایش/مخفی کردن گذرواژه"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="گذرواژه خود را وارد کنید"
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
                  {loginMutation.isLoading ? 'در حال ورود...' : 'ورود'}
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