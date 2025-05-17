/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useLogout } from '../../../../../hooks/api/auth/useLogout';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

// project imports
import EditProfileTab from './EditProfileTab ';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab({ userProfile, loading }) {
  const logoutMutation = useLogout();
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate(); 
  };
  
  const handleOpenEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
  };

  // اگر صفحه ویرایش پروفایل نمایش داده شود
  if (showEditProfile) {
    return (
      <EditProfileTab 
        userProfile={userProfile} 
        loading={loading} 
        onClose={handleCloseEditProfile} 
      />
    );
  }

  // در غیر این صورت، منوی اصلی را نمایش بده
  return (
    <Box>
      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
        <ListItemButton onClick={handleOpenEditProfile}>
          <ListItemIcon>
            <EditOutlined />
          </ListItemIcon>
          <ListItemText primary="ویرایش پروفایل" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <UserOutlined />
          </ListItemIcon>
          <ListItemText primary="نمایش پروفایل" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <ProfileOutlined />
          </ListItemIcon>
          <ListItemText primary=" پروفایل عمومی" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <WalletOutlined />
          </ListItemIcon>
          <ListItemText primary="وضعیت و آمار" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText primary={"خروج"} />
        </ListItemButton>
      </List>
    </Box>
  );
}