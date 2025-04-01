import { Link } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/AuthLogin';

// ================================|| JWT - LOGIN (FA) ||================================ //

export default function Login() {
  return (
    <AuthWrapper>
      <Grid container spacing={3} sx={{ direction: 'ltr' }}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            sx={{
              alignItems: 'baseline',
              justifyContent: 'flex-end',
              mb: { xs: -0.5, sm: 0.5 }
            }}
          >
            <Typography variant="h3">ورود</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
