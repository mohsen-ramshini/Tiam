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
  TableRow
} from '@mui/material';
import Cookies from 'js-cookie';
import { useFetchRecords } from '/src/hooks/api/useFetchRecords';
import SearchBar from '/src/components/SearchBar';

const headCells = [
  { id: 'id', align: 'left', label: 'شناسه' },
  { id: 'prob_name', align: 'left', label: 'پرابلم' },
  { id: 'task_name', align: 'left', label: 'تسک' },
  { id: 'service_name', align: 'left', label: 'سرویس' },
  { id: 'host', align: 'left', label: 'هاست' },
  { id: 'result', align: 'left', label: 'نتیجه' },
  { id: 'ip', align: 'left', label: 'آی‌پی' },
  { id: 'created_at', align: 'left', label: 'تاریخ ایجاد' },
];

function OrderTableHead({ order, orderBy }) {
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

OrderTableHead.propTypes = {
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
  const [searchQuery, setSearchQuery] = useState('');

  // ریست کردن صفحه به 0 وقتی searchQuery تغییر کند
  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  const apiRows = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];

    return apiData.map(item => ({
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

  const filteredRows = useMemo(() => {
    if (!searchQuery) return apiRows;

    const lowerCaseQuery = searchQuery.toLowerCase();
    return apiRows.filter(row =>
      (row.service_name && row.service_name.toLowerCase().includes(lowerCaseQuery)) ||
      (row.host && row.host.toLowerCase().includes(lowerCaseQuery)) ||
      (row.ip && row.ip.toLowerCase().includes(lowerCaseQuery)) ||
      (row.result && row.result.toLowerCase().includes(lowerCaseQuery))
    );
  }, [apiRows, searchQuery]);

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
      {/* کامپوننت سرچ */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {visibleRows.map((row, index) => (
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
            ))}
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
