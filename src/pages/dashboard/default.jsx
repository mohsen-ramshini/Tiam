/* eslint-disable prettier/prettier */
// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import SaleReportCard from 'sections/dashboard/default/SaleReportCard';
import OrdersTable from 'sections/dashboard/default/OrdersTable';

// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import PageLoadTimeChart from '../../sections/dashboard/default/PageLoadTime';
import MapComponent from '../../sections/dashboard/probesMap/map';
import Heatmap from '../../sections/dashboard/chart/HeatMap';
import DNSProbePieChart from '../../sections/dashboard/chart/PieChart';
import NetworkChart from '../../sections/dashboard/chart/Barchart';
import MultiHostLineChartWithMUI from '../../sections/dashboard/chart/MultiLineChart';

const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

export default function DashboardDefault() {
  return (
    <Grid container spacing={2.75} >
      {/* Title */}
      <Grid item xs={12}>
        <Typography variant="h5">داشبورد</Typography>
      </Grid>

      {/* Stat Cards */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="تعداد پروب های فعال" count="4,42,236" percentage={59.3} extra="35,000" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="تعداد تست ها در یکروز گذشته " count="78,250" percentage={70.5} extra="8,900" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="تعداد هشدارهای اخیر" count="18,800" percentage={27.4} isLoss color="warning" extra="1,943" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="تعداد پروب های غیر فعال" count="35,078" percentage={27.4} isLoss color="warning" extra="20,395" />
      </Grid>

      {/* Map + Heatmap & DNS side by side */}
      <Grid item container xs={12} spacing={2}>
        {/* Map: نصف عرض */}
        <Grid item xs={12} md={6}>
          <MainCard title="نقشه پراب ها" sx={{ mt: 2 }} content={false}>
            <Box sx={{ p: 3, pb: 0 }}>
              <MapComponent />
            </Box>
          </MainCard>
        </Grid>

        {/* Heatmap و DNS stacked vertically */}
        <Grid item xs={12} md={6} container direction="column" spacing={2}>
          <Grid item>
            <MainCard title="نقشه حرارتی" content={false}>
              <Box sx={{ p: 3, pb: 0 }}>
                <Heatmap />
              </Box>
            </MainCard>
          </Grid>
          <Grid item sx={{ mt: 2 }}>
            <MainCard title="توزیع DNS" content={false}>
              <Box sx={{ p: 3, pb: 0 }}>
                <DNSProbePieChart />
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>

      {/* Network Chart */}
      <Grid item xs={12} md={6} lg={6}>
        <MainCard title="نمودار شبکه" sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <MultiHostLineChartWithMUI />
          </Box>
        </MainCard>
      </Grid>

      {/* Page Load Time */}
      <Grid item xs={12} md={6} lg={6}>
        <MainCard title="نمودار زمان بارگذاری صفحه" sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <PageLoadTimeChart />
          </Box>
        </MainCard>
      </Grid>

    </Grid>
  );
}
