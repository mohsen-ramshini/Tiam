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
  useMediaQuery,
  useTheme,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Box,
  Tooltip
} from '@mui/material';
import { Edit, Delete, Add, Assessment, GitHub, Code } from '@mui/icons-material';

import useFetchTasks from '../../hooks/api/dashboard/tasks/useFetchTasks';
import useCreateTask from '../../hooks/api/dashboard/tasks/useCreateTask';
import useUpdateTask from '../../hooks/api/dashboard/tasks/useUpdateTask';
import useDeleteTask from '../../hooks/api/dashboard/tasks/useDeleteTask';

import { toast } from 'sonner';

const CreateTask = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gitRepo, setGitRepo] = useState('');
  const [entrypoint, setEntrypoint] = useState('');
  const [metric, setMetric] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  const { data: tasks = [], isLoading } = useFetchTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const theme = useTheme();
  // تعریف breakpoint برای صفحات با عرض کم
  const isXxsScreen = useMediaQuery('(max-width:320px)'); // برای صفحه‌های 320px
  const isXsScreen = useMediaQuery('(max-width:480px)');
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));

  // اضافه کردن اسکرول به بالا پس از تغییر در لیست تسک‌ها
  useEffect(() => {
    if (createTaskMutation.isSuccess || updateTaskMutation.isSuccess || deleteTaskMutation.isSuccess) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [createTaskMutation.isSuccess, updateTaskMutation.isSuccess, deleteTaskMutation.isSuccess]);

  const handleOpen = () => {
    setName('');
    setDescription('');
    setGitRepo('');
    setEntrypoint('');
    setMetric('');
    setIsActive(true);
    setEditId(null);
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || !gitRepo || !entrypoint || !metric) {
      setError('لطفاً همه فیلدها را پر کنید');
      toast.error('لطفاً همه فیلدها را پر کنید');
      return;
    }

    const payload = { name, description, git_repo: gitRepo, entrypoint, metric, is_active: isActive };

    setError(null);

    if (editId) {
      updateTaskMutation.mutate({ id: editId, data: payload });
    } else {
      createTaskMutation.mutate(payload);
    }

    setOpen(false);
  };

  const handleEdit = (task) => {
    setName(task.name);
    setDescription(task.description);
    setGitRepo(task.git_repo);
    setEntrypoint(task.entrypoint);
    setMetric(task.metric);
    setIsActive(task.is_active);
    setEditId(task.id);
    setError(null);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این تسک مطمئن هستید؟')) {
      deleteTaskMutation.mutate(id);
    }
  };

  // نمایش کارت‌ها در نمای خیلی کوچک و موبایل
  const renderMobileView = () => (
    <Grid container spacing={isXxsScreen ? 0.5 : 2}>
      {tasks.length === 0 ? (
        <Grid item xs={12}>
          <Card sx={{ textAlign: 'center', py: isXxsScreen ? 1 : 2 }}>
            <Typography variant={isXxsScreen ? 'caption' : 'body1'} sx={{ fontSize: isXxsScreen ? '0.65rem' : 'inherit' }}>
              هیچ تسکی یافت نشد.
            </Typography>
          </Card>
        </Grid>
      ) : (
        tasks.map((task) => (
          <Grid item xs={12} key={task.id}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%', 
                boxShadow: isXxsScreen ? 0 : 1,
                border: isXxsScreen ? '1px solid #eee' : 'inherit'
              }}
            >
              <CardContent sx={{ pb: 0, px: isXxsScreen ? 1 : 2, pt: isXxsScreen ? 1 : 2 }}>
                <Box 
                  display="flex" 
                  flexDirection={isXxsScreen ? 'column' : 'row'}
                  justifyContent="space-between" 
                  alignItems={isXxsScreen ? 'flex-start' : 'center'} 
                  mb={isXxsScreen ? 0.5 : 1}
                >
                  <Typography 
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: isXxsScreen ? '0.75rem' : '1rem',
                      mb: isXxsScreen ? 0.5 : 0,
                      lineHeight: 1.2
                    }}
                  >
                    {task.name}
                  </Typography>
                  <Chip 
                    icon={<Assessment sx={{ fontSize: isXxsScreen ? '0.7rem' : '1rem' }} />} 
                    label={task.metric} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ 
                      fontSize: isXxsScreen ? '0.6rem' : '0.7rem',
                      height: isXxsScreen ? '20px' : '24px',
                      '& .MuiChip-label': {
                        px: isXxsScreen ? 0.5 : 1
                      }
                    }}
                  />
                </Box>
                
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
                  {task.description}
                </Typography>
                
                {isXxsScreen ? (
                  <Tooltip title={`Git: ${task.git_repo}\nEntrypoint: ${task.entrypoint}`}>
                    <Box display="flex" justifyContent="flex-end">
                      <Typography 
                        color="primary" 
                        sx={{ 
                          fontSize: '0.6rem', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <GitHub sx={{ fontSize: '0.7rem', mr: 0.25 }} />
                        جزئیات
                      </Typography>
                    </Box>
                  </Tooltip>
                ) : (
                  <Box display="flex" gap={0.5} flexWrap="wrap">
                    <Tooltip title={task.git_repo}>
                      <Chip 
                        icon={<GitHub fontSize="small" />} 
                        label={task.git_repo.split('/').pop()} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.7rem',
                          height: '24px'
                        }} 
                      />
                    </Tooltip>
                    <Tooltip title={task.entrypoint}>
                      <Chip 
                        icon={<Code fontSize="small" />} 
                        label={task.entrypoint} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.7rem',
                          height: '24px'
                        }} 
                      />
                    </Tooltip>
                  </Box>
                )}
              </CardContent>
              
              <CardActions 
                sx={{ 
                  px: isXxsScreen ? 1 : 2, 
                  pt: isXxsScreen ? 0 : 1,
                  pb: isXxsScreen ? 1 : 1,
                  justifyContent: isXxsScreen ? 'flex-end' : 'flex-start'
                }}
              >
                {isXxsScreen ? (
                  <Box display="flex" gap={0.5}>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleEdit(task)}
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
                      onClick={() => handleDelete(task.id)}
                      sx={{ 
                        padding: '2px',
                        '& svg': { fontSize: '0.85rem' }
                      }}
                    >
                      <Delete fontSize="inherit" />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="primary" 
                      startIcon={<Edit fontSize="small" />}
                      onClick={() => handleEdit(task)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      ویرایش
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error" 
                      startIcon={<Delete fontSize="small" />}
                      onClick={() => handleDelete(task.id)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      حذف
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );

  // نمایش جدول در نمای دسکتاپ
  const renderDesktopView = () => (
    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
      <Table size={isMediumScreen ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>نام</TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: isMediumScreen ? 150 : 250 }}>توضیحات</TableCell>
            <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>مترک</TableCell>
            {!isSmallScreen && (
              <>
                <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>گیت ریپو</TableCell>
                <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>ورودی</TableCell>
              </>
            )}
            <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isSmallScreen ? 4 : 6} align="center">
                هیچ تسکی یافت نشد.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{task.name}</TableCell>
                <TableCell sx={{ 
                  maxWidth: isMediumScreen ? 150 : 250, 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: isMediumScreen ? 'nowrap' : 'normal'
                }}>
                  {task.description}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{task.metric}</TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell sx={{ 
                      maxWidth: 120, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      <Tooltip title={task.git_repo}>
                        <span>{task.git_repo}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ 
                      maxWidth: 120, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      <Tooltip title={task.entrypoint}>
                        <span>{task.entrypoint}</span>
                      </Tooltip>
                    </TableCell>
                  </>
                )}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEdit(task)} 
                      size={isMediumScreen ? 'small' : 'medium'}
                    >
                      <Edit fontSize={isMediumScreen ? 'small' : 'medium'} />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(task.id)} 
                      size={isMediumScreen ? 'small' : 'medium'}
                    >
                      <Delete fontSize={isMediumScreen ? 'small' : 'medium'} />
                    </IconButton>
                  </Box>
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
          مدیریت تسک‌ها
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
            size={isXxsScreen ? 'small' : (isSmallScreen ? 'small' : 'medium')}
            sx={{ 
              fontSize: isXxsScreen ? '0.65rem' : 'inherit',
              py: isXxsScreen ? 0 : 'inherit',
              minWidth: isXxsScreen ? '0' : '64px',
              minHeight: isXxsScreen ? '24px' : 'inherit'
            }}
          >
            {isXxsScreen ? '+' : <><Add /> افزودن تسک</>}
          </Button>
        </Stack>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={isXxsScreen ? 2 : 4}>
            <CircularProgress size={isXxsScreen ? 20 : 40} />
          </Box>
        ) : isMobileView ? renderMobileView() : renderDesktopView()}
      </Box>

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
          {editId ? 'ویرایش تسک' : 'افزودن تسک'}
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
                label="نام تسک"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                error={!!error && !name}
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
                label="مترک (metric)"
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                fullWidth
                error={!!error && !metric}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={isXxsScreen ? 2 : 3}
                error={!!error && !description}
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
            
            <Grid item xs={12}>
              <TextField
                label="گیت ریپو"
                value={gitRepo}
                onChange={(e) => setGitRepo(e.target.value)}
                fullWidth
                error={!!error && !gitRepo}
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
                label="ورودی (entrypoint)"
                value={entrypoint}
                onChange={(e) => setEntrypoint(e.target.value)}
                fullWidth
                error={!!error && !entrypoint}
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
            
            {error && (
              <Grid item xs={12}>
                <Typography 
                  color="error" 
                  sx={{ 
                    mt: 0.5, 
                    fontSize: isXxsScreen ? '0.65rem' : '0.75rem' 
                  }}
                >
                  {error}
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
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={createTaskMutation.isLoading || updateTaskMutation.isLoading}
            size="small"
            sx={{ 
              fontSize: isXxsScreen ? '0.65rem' : '0.75rem',
              minWidth: isXxsScreen ? '60px' : '64px',
              py: isXxsScreen ? 0.5 : 'inherit'
            }}
          >
            {(createTaskMutation.isLoading || updateTaskMutation.isLoading) ? (
              <CircularProgress size={isXxsScreen ? 12 : 16} color="inherit" />
            ) : (
              editId ? 'ذخیره' : 'افزودن'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CreateTask;