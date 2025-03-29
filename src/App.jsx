import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { UserProvider } from './contexts/UserContext';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <UserProvider>
      <ThemeCustomization>
        <ScrollTop>
          <RouterProvider router={router} />
        </ScrollTop>
      </ThemeCustomization>
    </UserProvider>
  );
}
