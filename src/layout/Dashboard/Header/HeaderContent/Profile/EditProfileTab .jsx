/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// icons
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import KeyOutlined from '@ant-design/icons/KeyOutlined';

// api
import axiosInstance from 'api/axiosInstance';

// TabPanel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-edit-tabpanel-${index}`}
      aria-labelledby={`profile-edit-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `profile-edit-tab-${index}`,
    'aria-controls': `profile-edit-tabpanel-${index}`,
  };
}

// Edit Profile Component
const EditProfileTab = ({ userProfile, loading, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Password states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (userProfile && !loading) {
      setFormData({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        email: userProfile.email || '',
        username: userProfile.username || ''
      });
    }
  }, [userProfile, loading]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Profile update handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdateProfile = async () => {
    setUpdateError('');
    setUpdateSuccess(false);
    setUpdateLoading(true);
    
    try {
      await axiosInstance.patch('/users/profile/', formData);
      setUpdateSuccess(true);
      // Refresh page or update user profile in parent component if needed
    } catch (err) {
      if (err.response && err.response.data) {
        // Handle validation errors
        const errorsArray = [];
        Object.keys(err.response.data).forEach(key => {
          errorsArray.push(`${key}: ${err.response.data[key]}`);
        });
        setUpdateError(errorsArray.join(', '));
      } else {
        setUpdateError('خطایی در ارتباط با سرور رخ داد.');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  // Password change handlers
  const handleOldPasswordToggle = () => {
    setShowOldPassword(!showOldPassword);
  };
  
  const handleNewPasswordToggle = () => {
    setShowNewPassword(!showNewPassword);
  };
  
  const handleConfirmPasswordToggle = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const validatePasswordForm = () => {
    if (!oldPassword) {
      setPasswordError('لطفاً کلمه عبور فعلی را وارد کنید');
      return false;
    }
    if (!newPassword) {
      setPasswordError('لطفاً کلمه عبور جدید را وارد کنید');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('کلمه عبور جدید و تکرار آن مطابقت ندارند');
      return false;
    }
    if (newPassword.length < 8) {
      setPasswordError('کلمه عبور جدید باید حداقل ۸ کاراکتر باشد');
      return false;
    }
    return true;
  };
  
  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess(false);
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setPasswordLoading(true);
    try {
      await axiosInstance.post('/users/change-password/', {
        old_password: oldPassword,
        new_password: newPassword
      });
      
      setPasswordSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.old_password) {
          setPasswordError(err.response.data.old_password[0]);
        } else if (err.response.data.new_password) {
          setPasswordError(err.response.data.new_password[0]);
        } else if (err.response.data.detail) {
          setPasswordError(err.response.data.detail);
        } else {
          setPasswordError('خطایی رخ داد. لطفاً مجدداً تلاش کنید.');
        }
      } else {
        setPasswordError('خطایی در ارتباط با سرور رخ داد.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader 
        title="ویرایش پروفایل"
        titleTypographyProps={{ variant: 'h5' }}
        action={
          <Button variant="outlined" color="primary" onClick={onClose}>
            بازگشت
          </Button>
        }
      />
      <Divider />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="profile edit tabs"
          variant="fullWidth"
        >
          <Tab 
            icon={<UserOutlined />} 
            label="اطلاعات کاربری" 
            iconPosition="start"
            {...a11yProps(0)} 
          />
          <Tab 
            icon={<KeyOutlined />} 
            label="تغییر رمز عبور" 
            iconPosition="start"
            {...a11yProps(1)} 
          />
        </Tabs>
      </Box>
      
      <CardContent>
        {/* User Info Tab */}
        <TabPanel value={tabValue} index={0}>
          {updateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {updateError}
            </Alert>
          )}
          
          {updateSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              اطلاعات پروفایل با موفقیت به‌روزرسانی شد!
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="نام"
                name="first_name"
                value={formData.first_name}
                onChange={handleFormChange}
                disabled={loading || updateLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="نام خانوادگی"
                name="last_name"
                value={formData.last_name}
                onChange={handleFormChange}
                disabled={loading || updateLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ایمیل"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                disabled={loading || updateLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="نام کاربری"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                disabled={loading || updateLoading || true} // نام کاربری معمولاً قابل تغییر نیست
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateProfile}
                  disabled={loading || updateLoading}
                  startIcon={updateLoading ? <CircularProgress size={16} /> : null}
                >
                  {updateLoading ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی پروفایل'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Password Change Tab */}
        <TabPanel value={tabValue} index={1}>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          
          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              کلمه عبور با موفقیت تغییر یافت!
            </Alert>
          )}
          
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="کلمه عبور فعلی"
              variant="outlined"
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleOldPasswordToggle}
                      edge="end"
                    >
                      {showOldPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              fullWidth
              label="کلمه عبور جدید"
              variant="outlined"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleNewPasswordToggle}
                      edge="end"
                    >
                      {showNewPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              fullWidth
              label="تکرار کلمه عبور جدید"
              variant="outlined"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleConfirmPasswordToggle}
                      edge="end"
                    >
                      {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
                disabled={passwordLoading}
                startIcon={passwordLoading ? <CircularProgress size={16} /> : null}
              >
                {passwordLoading ? 'در حال پردازش...' : 'تغییر رمز عبور'}
              </Button>
            </Box>
          </Stack>
        </TabPanel>
      </CardContent>
    </Card>
  );
};

EditProfileTab.propTypes = {
  userProfile: PropTypes.object,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

export default EditProfileTab;