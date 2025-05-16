import { useState } from 'react';
import { Box, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Divider, IconButton, Button, Collapse } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchOutlined from '@ant-design/icons/SearchOutlined'; // آیکن جستجو

// api hooks
import { useFetchHosts } from '../../../../hooks/api/dashboard/search/useFetchHosts';
import { useFetchMetrics } from '../../../../hooks/api/dashboard/search/useFetchMetrics';
import { useSearch } from '../../../../hooks/api/dashboard/search/useSearch';

const AutocompleteField = ({ label, value, onChange, options, loading }) => (
  <Autocomplete
    options={options || []}
    loading={loading}
    value={value}
    onChange={(event, newValue) => onChange(newValue || '')}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        size="small"
        placeholder={`انتخاب یا تایپ ${label.toLowerCase()}`}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ccc',
            },
            '&:hover fieldset': {
              borderColor: '#4caf50', // رنگ حین hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4caf50', // رنگ در حالت فاکوس
            },
          },
        }}
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <SearchOutlined style={{ marginRight: 8, color: '#4caf50' }} />
          ),
          endAdornment: (
            <>
              {loading ? <CircularProgress color="inherit" size={20} /> : null}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    )}
  />
);

export default function Search() {
  const [host, setHost] = useState('');
  const [metric, setMetric] = useState('');
  const [openSearch, setOpenSearch] = useState(false); // کنترل باز یا بسته بودن پنجره جستجو

  const { data: hosts, isLoading: hostsLoading } = useFetchHosts();
  const { data: metrics, isLoading: metricsLoading } = useFetchMetrics();
  const { data: searchResults, isLoading: searchLoading } = useSearch({ host, metric });

  const handleToggleSearch = () => {
    setOpenSearch(!openSearch); // تغییر وضعیت پنجره جستجو
  };

  return (
    <div style={{width:"100vw",marginRight:25}}>
      {/* اگر پنجره جستجو باز است، صفحه را تار می‌کنیم */}
      {openSearch && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // لایه شفاف سیاه برای تار کردن صفحه
          zIndex: 9998, // زیر پنجره جستجو
        }} />
      )}

      {/* کانتینر برای دکمه جستجو و پنجره جستجو */}
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        
        {/* آیکن جستجو برای باز کردن پنجره جستجو */}
        <IconButton
          onClick={handleToggleSearch}
          sx={{
            fontSize: 30,
            color: '#1978fc',
            '&:hover': {
              backgroundColor: '#f1f1f1',
              borderRadius: '50%',
            },
          }}
        >
          <SearchOutlined />
        </IconButton>

        {/* پنجره جستجو با موقعیت مطلق در کنار اینپوت */}
        <Collapse in={openSearch}>
          <Box sx={{
            position: 'absolute',
            top: '40px', // فاصله از بالای اینپوت
            left: 0,
            backgroundColor: 'background.paper',
            boxShadow: 3,
            borderRadius: 2,
            p: 3,
            mt: 2,
            width: '400px', // عرض پنجره جستجو
            zIndex: 9999, // اطمینان از اینکه پنجره در بالای سایر محتویات باشد
          }}>
            <Typography variant="h6" align="center" sx={{ mb: 3 }}>
              جستجو
            </Typography>

            {/* Autocomplete هاست */}
            <AutocompleteField
              label="هاست"
              value={host}
              onChange={setHost}
              options={hosts}
              loading={hostsLoading}
            />

            {/* فاصله بین فیلد ها */}
            <Box sx={{ my: 2 }} />

            {/* Autocomplete متریک */}
            <AutocompleteField
              label="متریک"
              value={metric}
              onChange={setMetric}
              options={metrics}
              loading={metricsLoading}
            />

            <Divider sx={{ my: 2 }} />

            {/* نمایش نتایج جستجو */}
            {searchLoading && <Typography variant="body2" align="center" color="textSecondary">در حال جستجو...</Typography>}

            {searchResults && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom align="center">نتایج جستجو:</Typography>

                {/* جدول نتایج جستجو */}
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>نتیجه</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>IP</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>موقعیت</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>ارائه‌دهنده</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchResults.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.result}</TableCell>
                          <TableCell>{row.ip || 'N/A'}</TableCell>
                          <TableCell>{row.location || 'N/A'}</TableCell>
                          <TableCell>{row.provider || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* دکمه بستن */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleToggleSearch}
                sx={{
                  borderRadius: 2,
                  padding: '8px 16px',
                  fontSize: '14px',
                  textTransform: 'none',
                  borderColor: '#4caf50', // رنگ مرزی
                  '&:hover': {
                    borderColor: '#388e3c', // رنگ مرزی هنگام hover
                    backgroundColor: '#f1f1f1',
                  },
                }}
              >
                بستن
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </div>
  );
}
