/* eslint-disable prettier/prettier */
// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';


// charts and map components
import PageLoadTimeChart from '../../sections/dashboard/default/PageLoadTime';
import MapComponent from '../../sections/dashboard/probesMap/map';
import Heatmap from '../../sections/dashboard/chart/HeatMap';
import DNSProbePieChart from '../../sections/dashboard/chart/PieChart';
import MultiHostLineChartWithMUI from '../../sections/dashboard/chart/MultiLineChart';


export default function DashboardDefault() {
  return (
    <Grid container spacing={2.75}>
      {/* عنوان صفحه */}
      <Grid item xs={12}>
        <Typography variant="h5">داشبورد</Typography>
      </Grid>

      {/* کارت‌های آماری */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="تعداد پروب های فعال" count="442,236" percentage={59.3} extra="35,000" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="تعداد تست ها در یکروز گذشته" count="78,250" percentage={70.5} extra="8,900" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="تعداد هشدارهای اخیر" count="18,800" percentage={27.4} isLoss color="warning" extra="1,943" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="تعداد پروب های غیر فعال" count="35,078" percentage={27.4} isLoss color="warning" extra="20,395" />
      </Grid>

      {/* بخش نقشه و نمودارهای حرارتی و DNS */}
      <Grid item container xs={12} spacing={2}>
        <Grid item xs={12} md={6}>
          <MainCard title="نقشه پراب ها" sx={{ mt: 2 }} content={false}>
            <Box sx={{ p: 3, pb: 0 }}>
              <MapComponent />
            </Box>
          </MainCard>
        </Grid>

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

      {/* نمودار شبکه */}
      <Grid item xs={12} md={6} lg={6}>
        <MainCard title="نمودار شبکه" sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <MultiHostLineChartWithMUI />
          </Box>
        </MainCard>
      </Grid>

      {/* نمودار زمان بارگذاری صفحه */}
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
