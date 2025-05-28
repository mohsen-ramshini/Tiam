import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

import PageLoadTimeChart from '../../sections/dashboard/default/PageLoadTime';
import MapComponent from '../../sections/dashboard/probesMap/map';
import Heatmap from '../../sections/dashboard/chart/HeatMap';
import DNSProbePieChart from '../../sections/dashboard/chart/PieChart';
import MultiHostLineChartWithMUI from '../../sections/dashboard/chart/MultiLineChart';

export default function DashboardDefault() {
  const analyticsCards = [
    {
      title: 'تعداد پروب های فعال',
      count: '442,236',
      percentage: 59.3,
      extra: '35,000'
    },
    {
      title: 'تعداد تست ها در یکروز گذشته',
      count: '78,250',
      percentage: 70.5,
      extra: '8,900'
    },
    {
      title: 'تعداد هشدارهای اخیر',
      count: '18,800',
      percentage: 27.4,
      isLoss: true,
      color: 'warning',
      extra: '1,943'
    },
    {
      title: 'تعداد پروب های غیر فعال',
      count: '35,078',
      percentage: 27.4,
      isLoss: true,
      color: 'warning',
      extra: '20,395'
    }
  ];

  return (
    <Grid container spacing={3}>
      {/* تیتر صفحه */}
      <Grid item xs={12}>
        <Typography variant="h5" component="h1" gutterBottom>
          داشبورد
        </Typography>
      </Grid>

      {/* کارت‌های آماری */}
      {analyticsCards.map((card, index) => (
        <Grid key={index} item xs={12} sm={6} md={3}>
          <AnalyticEcommerce {...card} />
        </Grid>
      ))}

      {/* بخش نقشه و نمودارها */}
      <Grid item xs={12} container spacing={3}>
        {/* ستون نقشه و نمودار خطی */}
        <Grid item xs={12} md={6} container direction="column" spacing={3}>
          <Grid item>
            <MainCard title="نقشه پراب ها" content={false}>
              <Box sx={{ p: 3, height: 500 }}>
                <MapComponent />
              </Box>
            </MainCard>
          </Grid>
          <Grid item>
            <MainCard title="نمودار شبکه" content={false}>
              <Box sx={{ p: 3 }}>
                <MultiHostLineChartWithMUI />
              </Box>
            </MainCard>
          </Grid>
        </Grid>

        {/* ستون Heatmap و Pie Chart */}
        <Grid item xs={12} md={6} container direction="column" spacing={3}>
          <Grid item>
            <MainCard title="نقشه حرارتی" content={false}>
              <Box sx={{ p: 3 }}>
                <Heatmap />
              </Box>
            </MainCard>
          </Grid>
          <Grid item sx={{width:"100%"}}>
            <MainCard title="توزیع DNS" content={false}>
              <Box sx={{ p: 3  }}>
                <DNSProbePieChart />
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>

      {/* نمودار زمان بارگذاری صفحه */}
      <Grid item xs={12}>
        <MainCard title="نمودار زمان بارگذاری صفحه" content={false}>
          <Box sx={{ p: 3 }}>
            <PageLoadTimeChart />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}
