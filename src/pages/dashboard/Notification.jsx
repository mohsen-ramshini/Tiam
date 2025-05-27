/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import MainCard from 'components/MainCard';
import {
  TextField,
  Button,
  Stack,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useFetchNotification } from '../../hooks/api/dashboard/notification/useFetchNotification';
import { useFetchUserNotification } from '../../hooks/api/dashboard/user-notification/useFetchUserNotification';

const NotificationList = () => {


  // TODO : user notification must fetched based on user permissions
  const { data: notification = [], isLoading: isFetching, refetch } = useFetchNotification();

  const theme = useTheme();
  const isXxsScreen = useMediaQuery('(max-width:320px)');
  const isXsScreen = useMediaQuery('(max-width:480px)');
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));


  const renderMobileView = () => (
    <Grid container spacing={isXxsScreen ? 0.5 : 2}>
      {notification.length === 0 ? (
        <Grid item xs={12}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2">هیچ سرویسی یافت نشد.</Typography>
          </Card>
        </Grid>
      ) : (
        notification.map((notif) => (
          <Grid item xs={12} key={notif.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ pb: 0 }}>
                <Typography variant="subtitle2" fontWeight="bold">{notif.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                  {notif.description}
                </Typography>
                <Tooltip title={notif.properties?.host || ''}>
                  <Chip
                    label={notif.properties?.host}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                </Tooltip>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );

  const renderDesktopView = () => (
    <TableContainer component={Paper}>
      <Table size={isMediumScreen ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell><Typography fontWeight="bold">نام</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">توضیحات</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">اعلان</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isFetching ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : notification.length > 0 ? (
            notification.map((notif) => (
              <TableRow key={notif.id}>
                <TableCell>{notif.name}</TableCell>
                <TableCell>{notif.description}</TableCell>
                <TableCell>
                  <Tooltip title={notif.properties?.host || ''}>
                    <span>{notif.properties?.host}</span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">هیچ اعلانی یافت نشد.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <MainCard title="مدیریت اعلان ها">ُ

      {isMobileView ? renderMobileView() : renderDesktopView()}

    </MainCard>
  );
};

export default NotificationList;
