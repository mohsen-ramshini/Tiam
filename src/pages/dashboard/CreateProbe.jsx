/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
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
  Tooltip,
  useMediaQuery,
  useTheme,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Divider
} from '@mui/material';
import { Edit, Delete, Add, ContentCopy } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useFetchProbes } from '../../hooks/api/dashboard/prob/useFetchProbs';
import { useCreateProbe } from '../../hooks/api/dashboard/prob/useCreateProbs';
import { useUpdateProbe } from '../../hooks/api/dashboard/prob/useUpdateProb';
import { useDeleteProbe } from '../../hooks/api/dashboard/prob/useDeleteProb';
import { useChangeProbToken } from '../../hooks/api/dashboard/prob/useChangeProbToken';
import { toast } from 'sonner';

const CreateProbe = () => {
  const [open, setOpen] = useState(false);
  const [selectedProbe, setSelectedProbe] = useState(null);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [tokenValue, setTokenValue] = useState('');
  const isEditMode = Boolean(selectedProbe);

  // Theme and responsive breakpoints
  const theme = useTheme();
  const isXxsScreen = useMediaQuery('(max-width:320px)'); // For very small screens (320px)
  const isXsScreen = useMediaQuery('(max-width:480px)'); // For small phones
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { name: '', description: '' }
  });

  const { data: { results: probes } = { results: [] }, isLoading } = useFetchProbes();

  const { mutate: createProbe } = useCreateProbe({ setError, reset, setOpen });
  const { mutate: updateProbe } = useUpdateProbe({ setError, setOpen });
  const { mutate: deleteProbe } = useDeleteProbe();

  const { mutate: changeToken } = useChangeProbToken({
    setError,
    reset,
    setOpen,
    onSuccessCallback: (token) => {
      setTokenValue(token);
      setTokenDialogOpen(true);
    }
  });

  // Scroll to top after mutations
  useEffect(() => {
    if (open === false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [open]);

  const onSubmit = (data) => {
    if (isEditMode) {
      updateProbe({ id: selectedProbe.id, data });
    } else {
      createProbe(data);
    }
  };

  const handleEdit = (probe) => {
    setSelectedProbe(probe);
    reset({ name: probe.name, description: probe.description });
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این پراب مطمئن هستید؟')) {
      deleteProbe(id);
    }
  };

  const handleOpen = () => {
    setSelectedProbe(null);
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProbe(null);
  };

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(tokenValue);
      toast.success('توکن کپی شد');
    } catch (err) {
      toast.error('خطا در کپی توکن');
    }
  };

  // Mobile view using cards
  const renderMobileView = () => (
    <Grid container spacing={isXxsScreen ? 0.5 : 2}>
      {probes.length === 0 ? (
        <Grid item xs={12}>
          <Card sx={{ textAlign: 'center', py: isXxsScreen ? 1 : 2 }}>
            <Typography variant={isXxsScreen ? 'caption' : 'body1'} sx={{ fontSize: isXxsScreen ? '0.65rem' : 'inherit' }}>
              هیچ پرابی یافت نشد.
            </Typography>
          </Card>
        </Grid>
      ) : (
        probes.map((probe) => (
          <Grid item xs={12} key={probe.id}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%', 
                boxShadow: isXxsScreen ? 0 : 1,
                border: isXxsScreen ? '1px solid #eee' : 'inherit'
              }}
            >
              <CardContent sx={{ pb: 0, px: isXxsScreen ? 1 : 2, pt: isXxsScreen ? 1 : 2 }}>
                <Typography 
                  component="div" 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: isXxsScreen ? '0.75rem' : '1rem',
                    mb: isXxsScreen ? 0.5 : 1,
                    lineHeight: 1.2
                  }}
                >
                  {probe.name}
                </Typography>
                
                {!isXxsScreen && <Divider sx={{ my: 0.5 }} />}
                
                <Typography 
                  color="text.secondary" 
                  sx={{ 
                    mb: isXxsScreen ? 0.5 : 1,
                    fontSize: isXxsScreen ? '0.65rem' : '0.875rem',
                    lineHeight: isXxsScreen ? 1.2 : 1.5,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2
                  }}
                >
                  {probe.description}
                </Typography>
              </CardContent>
              
              <CardActions 
                sx={{ 
                  px: isXxsScreen ? 1 : 2, 
                  pt: isXxsScreen ? 0 : 1,
                  pb: isXxsScreen ? 1 : 1,
                  justifyContent: 'space-between',
                  flexWrap: 'wrap'
                }}
              >
                <Box display="flex" gap={0.5}>
                  {isXxsScreen ? (
                    <>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleEdit(probe)}
                        sx={{ 
                          padding: '2px',
                          '& svg': { fontSize: '0.85rem' }
                        }}
                      >
                        <Edit fontSize="inherit" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(probe.id)}
                        sx={{ 
                          padding: '2px',
                          '& svg': { fontSize: '0.85rem' }
                        }}
                      >
                        <Delete fontSize="inherit" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="primary" 
                        startIcon={<Edit fontSize="small" />}
                        onClick={() => handleEdit(probe)}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        ویرایش
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        startIcon={<Delete fontSize="small" />}
                        onClick={() => handleDelete(probe.id)}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        حذف
                      </Button>
                    </>
                  )}
                </Box>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => changeToken({ id: probe.id })}
                  sx={{ 
                    mt: isXxsScreen ? 0.5 : 0,
                    fontSize: isXxsScreen ? '0.65rem' : '0.75rem',
                    py: isXxsScreen ? 0 : 0.5,
                    minHeight: isXxsScreen ? '20px' : '24px'
                  }}
                >
                  دریافت توکن
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );

  // Desktop view using table
  const renderDesktopView = () => (
    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
      <Table size={isMediumScreen ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>نام</TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: isMediumScreen ? 150 : 250 }}>توضیحات</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {probes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                هیچ پرابی یافت نشد.
              </TableCell>
            </TableRow>
          ) : (
            probes.map((probe) => (
              <TableRow key={probe.id}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{probe.name}</TableCell>
                <TableCell sx={{ 
                  maxWidth: isMediumScreen ? 150 : 250, 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: isMediumScreen ? 'nowrap' : 'normal'
                }}>
                  {probe.description}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEdit(probe)}
                      size={isMediumScreen ? 'small' : 'medium'}
                    >
                      <Edit fontSize={isMediumScreen ? 'small' : 'medium'} />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(probe.id)}
                      size={isMediumScreen ? 'small' : 'medium'}
                    >
                      <Delete fontSize={isMediumScreen ? 'small' : 'medium'} />
                    </IconButton>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => changeToken({ id: probe.id })}
                      sx={{ 
                        fontSize: isMediumScreen ? '0.7rem' : '0.8rem',
                        py: isMediumScreen ? 0 : 0.5,
                        minHeight: isMediumScreen ? '24px' : '30px'
                      }}
                    >
                      دریافت توکن
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <MainCard 
      title={
        <Typography 
          variant={isXxsScreen ? 'body1' : (isSmallScreen ? 'h6' : 'h5')} 
          component="div"
          sx={{ 
            fontWeight: 'bold',
            fontSize: isXxsScreen ? '0.85rem' : 'inherit' 
          }}
        >
          مدیریت پراب‌ها
        </Typography>
      }
      sx={{ 
        overflow: 'hidden', 
        '& .MuiCardContent-root': {
          p: isXxsScreen ? 1 : 2
        }
      }}
    >
      <Box sx={{ width: '100%', mb: isXxsScreen ? 1 : 2 }}>
        <Stack 
          direction="row" 
          justifyContent="flex-end" 
          sx={{ mb: isXxsScreen ? 1 : (isSmallScreen ? 1.5 : 2) }}
        >
          <Button 
            variant="contained" 
            onClick={handleOpen}
            startIcon={!isXxsScreen && <Add />}
            size={isXxsScreen ? 'small' : (isSmallScreen ? 'small' : 'medium')}
            sx={{ 
              fontSize: isXxsScreen ? '0.65rem' : 'inherit',
              py: isXxsScreen ? 0 : 'inherit',
              minWidth: isXxsScreen ? '0' : '64px',
              minHeight: isXxsScreen ? '24px' : 'inherit'
            }}
          >
            {isXxsScreen ? '+' : 'افزودن پراب'}
          </Button>
        </Stack>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={isXxsScreen ? 2 : 4}>
            <CircularProgress size={isXxsScreen ? 20 : 40} />
          </Box>
        ) : isMobileView ? renderMobileView() : renderDesktopView()}
      </Box>

      {/* دیالوگ ساخت / ویرایش پراب */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth={isXxsScreen ? "xs" : "sm"}
        fullScreen={isXsScreen}
        PaperProps={{
          sx: {
            m: isXxsScreen ? 1 : 2,
            width: isXxsScreen ? 'calc(100% - 16px)' : 'auto',
            maxHeight: isXxsScreen ? 'calc(100% - 16px)' : 'auto'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            p: isXxsScreen ? 1 : 2,
            fontSize: isXxsScreen ? '0.85rem' : (isSmallScreen ? '1.1rem' : '1.25rem')
          }}
        >
          {isEditMode ? 'ویرایش پراب' : 'افزودن پراب'}
        </DialogTitle>
        
        <DialogContent 
          dividers 
          sx={{ 
            p: isXxsScreen ? 1 : 2,
            '&.MuiDialogContent-dividers': {
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              py: isXxsScreen ? 1 : 2
            }
          }}
        >
          <Grid container spacing={isXxsScreen ? 1 : 2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                label="نام پراب"
                fullWidth
                {...register('name', { required: 'نام الزامی است' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                margin="dense"
                size="small"
                InputProps={{
                  style: {
                    fontSize: isXxsScreen ? '0.7rem' : '0.875rem',
                    height: isXxsScreen ? '32px' : 'auto'
                  }
                }}
                InputLabelProps={{
                  style: {
                    fontSize: isXxsScreen ? '0.7rem' : '0.875rem'
                  }
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    height: isXxsScreen ? '32px' : 'auto'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="توضیحات"
                fullWidth
                multiline
                rows={isXxsScreen ? 2 : 3}
                {...register('description', { required: 'توضیحات الزامی است' })}
                error={!!errors.description}
                helperText={errors.description?.message}
                margin="dense"
                size="small"
                InputProps={{
                  style: {
                    fontSize: isXxsScreen ? '0.7rem' : '0.875rem'
                  }
                }}
                InputLabelProps={{
                  style: {
                    fontSize: isXxsScreen ? '0.7rem' : '0.875rem'
                  }
                }}
              />
            </Grid>
            
            {errors.api && (
              <Grid item xs={12}>
                <Typography 
                  color="error" 
                  sx={{ 
                    mt: 0.5, 
                    fontSize: isXxsScreen ? '0.65rem' : '0.75rem' 
                  }}
                >
                  {errors.api.message}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions 
          sx={{ 
            p: isXxsScreen ? 1 : 2,
            justifyContent: 'space-between'
          }}
        >
          <Button 
            onClick={handleClose} 
            color="inherit"
            size="small"
            sx={{ 
              fontSize: isXxsScreen ? '0.65rem' : '0.75rem',
              minWidth: isXxsScreen ? '60px' : '64px',
              py: isXxsScreen ? 0.5 : 'inherit'
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            size="small"
            sx={{ 
              fontSize: isXxsScreen ? '0.65rem' : '0.75rem',
              minWidth: isXxsScreen ? '60px' : '64px',
              py: isXxsScreen ? 0.5 : 'inherit'
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={isXxsScreen ? 12 : 16} color="inherit" />
            ) : (
              isEditMode ? 'ذخیره' : 'افزودن'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* دیالوگ نمایش توکن */}
      <Dialog 
        open={tokenDialogOpen} 
        onClose={() => setTokenDialogOpen(false)} 
        fullWidth 
        maxWidth={isXxsScreen ? "xs" : "sm"}
        PaperProps={{
          sx: {
            m: isXxsScreen ? 1 : 2,
            width: isXxsScreen ? 'calc(100% - 16px)' : 'auto'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            p: isXxsScreen ? 1 : 2,
            fontSize: isXxsScreen ? '0.85rem' : (isSmallScreen ? '1.1rem' : '1.25rem')
          }}
        >
          توکن جدید
        </DialogTitle>
        <DialogContent sx={{ p: isXxsScreen ? 1 : 2 }}>
          <Typography sx={{ fontSize: isXxsScreen ? '0.7rem' : 'inherit' }}>
            توکن با موفقیت دریافت شد:
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
            <Typography
              sx={{
                wordBreak: 'break-all',
                fontWeight: 'bold',
                color: 'primary.main',
                flexGrow: 1,
                fontSize: isXxsScreen ? '0.65rem' : 'inherit'
              }}
            >
              {tokenValue}
            </Typography>
            <Tooltip title="کپی توکن">
              <IconButton 
                onClick={handleCopyToken} 
                color="primary"
                size={isXxsScreen ? 'small' : 'medium'}
              >
                <ContentCopy fontSize={isXxsScreen ? 'small' : 'medium'} />
              </IconButton>
            </Tooltip>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: isXxsScreen ? 1 : 2 }}>
          <Button 
            onClick={() => setTokenDialogOpen(false)} 
            color="primary"
            size={isXxsScreen ? 'small' : 'medium'}
            sx={{ fontSize: isXxsScreen ? '0.7rem' : 'inherit' }}
          >
            بستن
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CreateProbe;