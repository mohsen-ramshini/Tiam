/* eslint-disable prettier/prettier */
// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'فهرست',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'داشبورد',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'create-probe',
      title: 'ساخت پراب',
      type: 'item',
      url: '/create-probe',
      icon: icons.ProfileOutlined
    },
    {
      id: 'create-user',
      title: 'تعریف کاربر',
      type: 'item',
      url: '/create-user',
      icon: icons.ProfileOutlined
    }
  ]
};

export default dashboard;
