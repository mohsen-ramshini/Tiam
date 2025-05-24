/* eslint-disable prettier/prettier */
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));

  // set media wise responsive drawer
  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      <Drawer />

      <Box component="main"   sx={{
    width: 'calc(100% - 260px)',
    flexGrow: 1,
    p: { xs: 2, sm: 3 },
    bgcolor: 'background.default', // فقط در صورتی که ThemeProvider استفاده شده
    backgroundColor: 'var(--color-bg)', // در حالت عادی
    color: 'var(--color-text)'
  }}>
        <Toolbar sx={{ mt: 'inherit' }} />
        <Box
  sx={{
    px: { xs: 0, sm: 2 },
    position: 'relative',
    minHeight: 'calc(100vh - 110px)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent', // یا var(--color-surface) اگر کارت‌طور باشه
    color: 'var(--color-text)'
  }}
        >
          {pathname !== '/apps/profiles/account/my-account' && <Breadcrumbs />}
          <Outlet />
          {/* <Footer /> */}
        </Box>
      </Box>
    </Box>
  );
}
