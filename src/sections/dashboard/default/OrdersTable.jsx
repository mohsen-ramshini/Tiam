/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { NumericFormat } from 'react-number-format';

// project imports
import Dot from 'components/@extended/Dot';
import { useFetchRecords } from '/src/hooks/api/useFetchRecords';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function createData(tracking_no, name, fat, carbs, protein) {
  return { tracking_no, name, fat, carbs, protein };
}

const rows = [
  createData('77', '1404/01/01', 'تهران', 4, 2, 40570),
  createData('98', '1404/01/01', 'شیراز', 3, 0, 180139),
  createData('8', '1404/01/01', 'ساری', 5, 1, 90989),
  createData('56', '1404/01/01', 'اهواز', 5, 1, 10239),
  createData('64', '1404/01/01', 'گیلان', 1, 1, 83348),
  createData('4', '1404/01/01', 'بندرعباس', 9, 0, 410780),
  createData('6', '1404/01/01', 'قم', 1, 2, 70999),
  createData('86', '1404/01/01', 'سیستان و بلوچستان', 8, 2, 10570),
  createData('644', '1404/01/01', 'مشهد', 1, 1, 98063),
  createData('5', '1404/01/01', 'تبریز', 3, 0, 14001)
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'tracking_no',
    align: 'left',
    disablePadding: false,
    label: 'شناسه'
  },
  {
    id: 'tracking_no',
    align: 'left',
    disablePadding: false,
    label: 'تاریخ ایجاد'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: ' شهر'
  },
  {
    id: 'carbs',
    align: 'left',
    disablePadding: false,

    label: 'وضعیت'
  },
  {
    id: 'protein',
    align: 'left',
    disablePadding: false,
    label: 'تعداد بازدید'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  const [accessToken, setAccessToken] = useState(Cookies.get('access_token') || null);
  const { data: records, refetch: refetchRecords } = useFetchRecords(accessToken);

  useEffect(() => {
    refetchRecords();
  }, [refetchRecords]);

  useEffect(() => {
    console.log(`records:`, records);
    console.log(`token:`, accessToken);
  }, [records, accessToken]);
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

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable() {
  const order = 'asc';
  const orderBy = 'tracking_no';

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
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.tracking_no}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary">{row.tracking_no}</Link>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="left">{row.fat}</TableCell>
                  <TableCell>
                    <OrderStatus status={row.carbs} />
                  </TableCell>
                  <TableCell align="left">
                    <NumericFormat value={row.protein} displayType="text" thousandSeparator prefix="" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

OrderStatus.propTypes = { status: PropTypes.number };
