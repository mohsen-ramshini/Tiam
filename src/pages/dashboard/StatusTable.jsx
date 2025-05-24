/* eslint-disable prettier/prettier */
import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Grid,
  Paper,
  Typography,
  IconButton,
  Collapse,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { useFetchRecords } from '../../hooks/api/dashboard/records/useFetchRecords';

const headCells = [
  { id: 'id', align: 'left', label: 'شناسه', searchable: true, type: 'text' },
  { id: 'prob_name', align: 'left', label: 'پراب', searchable: true, type: 'select' },
  { id: 'task_name', align: 'left', label: 'تسک', searchable: true, type: 'select' },
  { id: 'service_name', align: 'left', label: 'سرویس', searchable: true, type: 'select' },
  { id: 'host', align: 'left', label: 'هاست', searchable: true, type: 'select' },
  { id: 'result', align: 'left', label: 'نتیجه', searchable: true, type: 'select' },
  { id: 'ip', align: 'left', label: 'آی‌پی', searchable: true, type: 'text' },
  { id: 'created_at', align: 'left', label: 'تاریخ ایجاد', searchable: false, type: 'date' },
];

// کامپوننت فیلتر پیشرفته
function AdvancedFilters({ filters, onFilterChange, onClearFilters, activeFiltersCount, dateRange, onDateRangeChange, uniqueValues }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderFilterField = (cell) => {
    if (cell.type === 'select') {
      const options = uniqueValues[cell.id] || [];
      return (
        <FormControl fullWidth size="small">
          <InputLabel>{cell.label}</InputLabel>
          <Select
            value={filters[cell.id] || 'all'}
            onChange={(e) => onFilterChange(cell.id, e.target.value === 'all' ? '' : e.target.value)}
            label={cell.label}
          >
            <MenuItem value="all">همه</MenuItem>
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    } else if (cell.type === 'text') {
      return (
        <TextField
          fullWidth
          size="small"
          label={`جستجو در ${cell.label}`}
          value={filters[cell.id] || ''}
          onChange={(e) => onFilterChange(cell.id, e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          variant="outlined"
        />
      );
    }
    return null;
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          <FilterIcon color="primary" />
          <Typography variant="h6">فیلتر و جستجو</Typography>
          {activeFiltersCount > 0 && (
            <Chip 
              label={`${activeFiltersCount} فیلتر فعال`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          {activeFiltersCount > 0 && (
            <IconButton 
              onClick={onClearFilters} 
              size="small" 
              title="پاک کردن همه فیلترها"
            >
              <ClearIcon />
            </IconButton>
          )}
          <IconButton 
            onClick={() => setIsExpanded(!isExpanded)}
            size="small"
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={isExpanded}>
        <Box mt={2}>
          {/* بخش فیلتر تاریخ */}
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DateRangeIcon fontSize="small" />
              فیلتر تاریخ
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="از تاریخ"
                  value={dateRange.startDate}
                  onChange={(e) => onDateRangeChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="تا تاریخ"
                  value={dateRange.endDate}
                  onChange={(e) => onDateRangeChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>

          {/* بخش فیلتر فیلدها */}
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon fontSize="small" />
              فیلتر فیلدها
            </Typography>
            <Grid container spacing={2}>
              {headCells.filter(cell => cell.searchable).map((cell) => (
                <Grid item xs={12} sm={6} md={4} key={cell.id}>
                  {renderFilterField(cell)}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}

AdvancedFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  activeFiltersCount: PropTypes.number.isRequired,
  dateRange: PropTypes.object.isRequired,
  onDateRangeChange: PropTypes.func.isRequired,
  uniqueValues: PropTypes.object.isRequired
};

function StatusTable({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

StatusTable.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string
};

export default function OrderTable() {
  const order = 'asc';
  const orderBy = 'id';
  const [accessToken] = useState(Cookies.get('access_token') || null);
  const { data: apiData = [], isLoading, error } = useFetchRecords(accessToken);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // state برای فیلترها
  const [filters, setFilters] = useState({});
  
  // state برای محدوده تاریخ
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // ریست کردن صفحه وقتی فیلترها تغییر کنند
  useEffect(() => {
    setPage(0);
  }, [filters, dateRange]);

  const apiRows = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];
    return apiData.results.map(item => ({
      id: item.id ?? '--',
      prob_name: item.task_assignment?.prob?.name ?? '--',
      task_name: item.task_assignment?.task?.name ?? '--',
      service_name: item.task_assignment?.service?.name ?? '--',
      host: item.task_assignment?.service?.properties?.host ?? '--',
      result: item.result ?? '--',
      ip: item.ip ?? '--',
      created_at: item.created_at ? new Date(item.created_at).toLocaleString('fa-IR') : '--'
    }));
  }, [apiData]);

  // استخراج مقادیر منحصر به فرد برای dropdown ها
  const uniqueValues = useMemo(() => {
    const values = {};
    
    headCells.forEach(cell => {
      if (cell.searchable && cell.type === 'select') {
        const fieldValues = apiRows
          .map(row => row[cell.id])
          .filter(value => value && value !== '--')
          .filter((value, index, array) => array.indexOf(value) === index)
          .sort();
        values[cell.id] = fieldValues;
      }
    });
    
    return values;
  }, [apiRows]);

  // فیلتر کردن داده‌ها بر اساس فیلترهای فعال و محدوده تاریخ
  const filteredRows = useMemo(() => {
    let result = apiRows;

    // فیلتر بر اساس فیلدهای متنی
    if (Object.keys(filters).length > 0) {
      result = result.filter(row => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value || value.trim() === '') return true;
          
          const cellValue = row[key];
          if (!cellValue || cellValue === '--') return false;
          
          return cellValue.toString().toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    // فیلتر بر اساس محدوده تاریخ
    if (dateRange.startDate || dateRange.endDate) {
      result = result.filter(row => {
        if (row.created_at === '--') return false;
        
        // تبدیل تاریخ فارسی به تاریخ میلادی برای مقایسه
        const rowDate = new Date(row.created_at);
        if (isNaN(rowDate.getTime())) return false;
        
        const rowDateString = rowDate.toISOString().split('T')[0];
        
        if (dateRange.startDate && rowDateString < dateRange.startDate) {
          return false;
        }
        
        if (dateRange.endDate && rowDateString > dateRange.endDate) {
          return false;
        }
        
        return true;
      });
    }

    return result;
  }, [apiRows, filters, dateRange]);

  // تعداد فیلترهای فعال (شامل فیلتر تاریخ)
  const activeFiltersCount = useMemo(() => {
    let count = Object.values(filters).filter(value => value && value.trim() !== '').length;
    if (dateRange.startDate || dateRange.endDate) count++;
    return count;
  }, [filters, dateRange]);

  // تغییر فیلتر
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // تغییر محدوده تاریخ
  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // پاک کردن همه فیلترها
  const handleClearFilters = () => {
    setFilters({});
    setDateRange({
      startDate: '',
      endDate: ''
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(
    () => filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredRows, page, rowsPerPage]
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="500px">
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return <div>خطا در دریافت داده‌ها: {error.message}</div>;
  }

  return (
    <Box>
      {/* کامپوننت فیلتر پیشرفته */}
      <AdvancedFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        uniqueValues={uniqueValues}
      />

      {/* نمایش تعداد نتایج */}
      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">
          {filteredRows.length === apiRows.length 
            ? `مجموع ${apiRows.length} رکورد`
            : `${filteredRows.length} رکورد از مجموع ${apiRows.length} رکورد یافت شد`
          }
        </Typography>
      </Box>
      
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table aria-labelledby="tableTitle">
          <StatusTable order={order} orderBy={orderBy} />
          <TableBody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row, index) => (
                <TableRow hover key={`${row.id}-${index}`}>
                  <TableCell align="left">{row.id}</TableCell>
                  <TableCell align="left">{row.prob_name}</TableCell>
                  <TableCell align="left">{row.task_name}</TableCell>
                  <TableCell align="left">{row.service_name}</TableCell>
                  <TableCell align="left">{row.host}</TableCell>
                  <TableCell align="left">{row.result}</TableCell>
                  <TableCell align="left">{row.ip}</TableCell>
                  <TableCell align="left">{row.created_at}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headCells.length} align="center">
                  <Typography variant="body2" color="text.secondary" py={3}>
                    {activeFiltersCount > 0 
                      ? 'هیچ رکوردی با این فیلترها یافت نشد'
                      : 'هیچ داده‌ای موجود نیست'
                    }
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="تعداد رکوردها در هر صفحه:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count !== -1 ? count : `بیشتر از ${to}`}`}
      />
    </Box>
  );
}