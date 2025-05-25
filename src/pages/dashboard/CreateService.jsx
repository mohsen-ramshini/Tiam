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
import { Edit, Delete, Add } from '@mui/icons-material';
import { useCreateService } from '../../hooks/api/dashboard/service/useCreateService';
import { useUpdateService } from '../../hooks/api/dashboard/service/useUpdateService';
import { useDeleteService } from '../../hooks/api/dashboard/service/useDeleteService';
import { useFetchServices } from '../../hooks/api/dashboard/service/useFetchService';

const CreateService = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [host, setHost] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const uniformButtonStyle = {
    fontSize: '0.75rem',
    py: 0.5,
    px: 1.5,
    minHeight: '30px',
    minWidth: '64px',
    textWrap: 'nowrap'
  };

  const { data: services = [], isLoading: isFetching, refetch } = useFetchServices();

  const theme = useTheme();
  const isXxsScreen = useMediaQuery('(max-width:320px)');
  const isXsScreen = useMediaQuery('(max-width:480px)');
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));

  const createMutation = useCreateService({
    onSuccessCallback: () => {
      refetch();
      handleClose();
    },
    onErrorCallback: () => setError('خطا در افزودن سرویس')
  });

  const updateMutation = useUpdateService({
    onSuccessCallback: () => {
      refetch();
      handleClose();
    },
    onErrorCallback: () => setError('خطا در ویرایش سرویس')
  });

  const deleteMutation = useDeleteService({
    onSuccessCallback: () => refetch()
  });

  const handleOpen = () => {
    setName('');
    setDescription('');
    setHost('');
    setEditId(null);
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !host) {
      setError('لطفاً تمامی فیلدها را پر کنید');
      return;
    }

    const payload = {
      name,
      description,
      properties: { host }
    };

    if (editId) {
      updateMutation.mutate({ id: editId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (service) => {
    setName(service.name);
    setDescription(service.description);
    setHost(service.properties?.host || '');
    setEditId(service.id);
    setError(null);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این سرویس مطمئن هستید؟')) {
      deleteMutation.mutate(id);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const renderMobileView = () => (
    <Grid container spacing={isXxsScreen ? 0.5 : 2}>
      {services.length === 0 ? (
        <Grid item xs={12}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2">هیچ سرویسی یافت نشد.</Typography>
          </Card>
        </Grid>
      ) : (
        services.map((service) => (
          <Grid item xs={12} key={service.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ pb: 0 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                  {service.description}
                </Typography>
                <Tooltip title={service.properties?.host || ''}>
                  <Chip label={service.properties?.host} variant="outlined" size="small" color="primary" />
                </Tooltip>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton size="small" color="primary" onClick={() => handleEdit(service)}>
                  <Edit fontSize="inherit" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(service.id)}>
                  <Delete fontSize="inherit" />
                </IconButton>
              </CardActions>
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
            <TableCell>
              <Typography fontWeight="bold">نام</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">توضیحات</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">هاست</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography fontWeight="bold">عملیات</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isFetching ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : services.length > 0 ? (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>
                  <Tooltip title={service.properties?.host || ''}>
                    <span>{service.properties?.host}</span>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEdit(service)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(service.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                هیچ سرویسی یافت نشد.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <MainCard title="مدیریت سرویس‌ها">
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: isXxsScreen ? 1 : 2 }}>
        <Button
          variant="contained"
          startIcon={isXxsScreen ? null : <Add />}
          size={isXxsScreen ? 'small' : 'medium'}
          sx={{ ...uniformButtonStyle, fontSize: isXxsScreen ? '0.7rem' : '0.8rem' }}
          onClick={handleOpen}
        >
          {isXxsScreen ? '+' : 'افزودن سرویس'}
        </Button>
      </Stack>

      {isMobileView ? renderMobileView() : renderDesktopView()}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={isXxsScreen ? 'xs' : 'sm'}
        fullScreen={isXsScreen}
        PaperProps={{
          sx: {
            m: isXxsScreen ? 1 : 2,
            width: isXxsScreen ? 'calc(100% - 16px)' : 'auto',
            maxHeight: isXxsScreen ? 'calc(100% - 16px)' : 'auto'
          }
        }}
      >
        <DialogTitle>{editId ? 'ویرایش سرویس' : 'افزودن سرویس'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="نام سرویس" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="توضیحات" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} />
            <TextField label="هاست (Host)" value={host} onChange={(e) => setHost(e.target.value)} fullWidth />
            {error && <Typography color="error">{error}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <DialogActions>
            <Button onClick={handleClose} color="secondary" sx={uniformButtonStyle}>
              انصراف
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSubmitting} sx={uniformButtonStyle}>
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : editId ? 'ذخیره تغییرات' : 'افزودن'}
            </Button>
          </DialogActions>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CreateService;
