/* eslint-disable prettier/prettier */
// material-ui
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

export default function AuthFooter() {
  return (
    <Container maxWidth="xl">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 2, justifyContent: { xs: 'center', sm: 'space-between' }, textAlign: { xs: 'center', sm: 'inherit' } }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: { xs: 1, sm: 3 }, textAlign: { xs: 'center', sm: 'inherit' } }}>
          <Typography
            variant="subtitle2"
            color="secondary"
            component={Link}
            href="#"
            target="_blank"
            underline="hover"
          >
            Terms and Conditions
          </Typography>
          <Typography
            variant="subtitle2"
            color="secondary"
            component={Link}
            href="#"
            target="_blank"
            underline="hover"
          >
            Privacy Policy
          </Typography>
        </Stack>
        <Typography variant="subtitle2" color="secondary" sx={{ textAlign: 'center' }}>
          © Made with love by Team{' '}
          <Link href="#" target="_blank" underline="hover">
            UniTeam
          </Link>
        </Typography>

      </Stack>
    </Container>
  );
}
