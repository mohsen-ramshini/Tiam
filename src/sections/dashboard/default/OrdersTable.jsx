/* eslint-disable prettier/prettier */
import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TablePagination
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import Cookies from 'js-cookie';
import Dot from 'components/@extended/Dot';
import { useFetchRecords } from '/src/hooks/api/useFetchRecords';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';



const headCells = [
  {
    id: 'tracking_no',
    align: 'left',
    disablePadding: false,
    label: 'پراب'
  },
  {
    id: 'protein',
    align: 'left',
    disablePadding: false,
    label: 'سرویس'
  },
  {
    id: 'data',
    align: 'left',
    disablePadding: true,
    label: ' داده'
  },
  {
    id: 'created_at',
    align: 'left',
    disablePadding: false,
    label: 'ساخته شده در'
  },
];

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
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

function OrderStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'هشدار';
      break;
    case 1:
      color = 'success';
      title = 'فعال';
      break;
    case 2:
      color = 'error';
      title = 'خطا';
      break;
    default:
      color = 'primary';
      title = 'غیرفعال';
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}
export default function OrderTable() {
  const order = 'asc';
  const orderBy = 'tracking_no';
  const [accessToken] = useState(Cookies.get('access_token') || null);
  const { data: apiData = [], isLoading, error } = useFetchRecords(accessToken);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const apiRows = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];
    
    return apiData.map(item => ({
      tracking_no: item.prob || '--',
      service: item.service || '--',
      data: item.data?.[1]?.value || '--', 
      created_at: item.created_at || '--'
    }));
  }, [apiData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(
    () => apiRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [apiRows, page, rowsPerPage]
  );

  if (isLoading) return <div>در حال بارگذاری داده‌ها...</div>;
  if (error) return <div>خطا در دریافت داده‌ها: {error.message}</div>;

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell align="right">پراب</TableCell>
              <TableCell align="right">سرویس</TableCell>
              <TableCell align="right">DNS</TableCell>
              <TableCell align="right">تاریخ ایجاد</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, index) => (
              <TableRow
                hover
                key={`${row.tracking_no}-${index}`}
              >
                <TableCell align="right">{row.tracking_no}</TableCell>
                <TableCell align="right">{row.service}</TableCell>
                <TableCell align="right">{row.data}</TableCell>
                <TableCell align="right">
                  {new Date(row.created_at).toLocaleString('fa-IR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={apiRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="تعداد رکوردها در هر صفحه:"
        labelDisplayedRows={({ from, to, count }) => {
          return `${from}-${to} از ${count !== -1 ? count : `بیشتر از ${to}`}`;
        }}
      />
    </Box>
  );
}