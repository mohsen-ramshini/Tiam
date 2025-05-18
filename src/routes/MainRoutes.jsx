/* eslint-disable prettier/prettier */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const CreateProbe = Loadable(lazy(() => import('pages/dashboard/CreateProbe.jsx')));
const CreateUser = Loadable(lazy(() => import('pages/dashboard/CreateUser.jsx')));
const CreateTask = Loadable(lazy(() => import('pages/dashboard/CreateTask.jsx')));
const CreateService = Loadable(lazy(() => import('pages/dashboard/CreateService.jsx')));
const TaskAssignment = Loadable(lazy(() => import('pages/dashboard/TaskAssignment.jsx')));
const AssertionRole = Loadable(lazy(() => import('pages/dashboard/CreateAssertionRole.jsx')));


const MainRoutes = {
  path: '/',
  element: <ProtectedRoute />,
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <DashboardDefault /> },
        { path: 'dashboard/default', element: <DashboardDefault /> },
        { path: 'typography', element: <Typography /> },
        { path: 'color', element: <Color /> },
        { path: 'shadow', element: <Shadow /> },
        { path: 'sample-page', element: <SamplePage /> },
        { path: 'create-probe', element: <CreateProbe /> },
        { path: 'create-user', element: <CreateUser /> },
        { path: 'create-task', element: <CreateTask /> },
        { path: 'create-service', element: <CreateService /> },
        { path: 'task-assignment', element: <TaskAssignment /> },
        { path: 'assertion-role', element: <AssertionRole /> }
      ]
    }
  ]
};

export default MainRoutes;
