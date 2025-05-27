/* eslint-disable prettier/prettier */
// assets
import { 
  DashboardOutlined,
  UserOutlined, 
  ClusterOutlined, 
  FileDoneOutlined, 
  AppstoreAddOutlined, 
  DeploymentUnitOutlined,
  NotificationOutlined,
  TableOutlined,
  WarningOutlined 
} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  ClusterOutlined,
  FileDoneOutlined,
  AppstoreAddOutlined,
  DeploymentUnitOutlined,
  NotificationOutlined,
  TableOutlined,
  WarningOutlined 
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
      id: 'status-table',
      title: 'جدول وضعیت',
      type: 'item',
      url: '/status-table',
      icon: icons.TableOutlined  // برای تسک اساینمنت (شبکه یا تخصیص)
    },
    {
      id: 'create-probe',
      title: 'پراب ها',
      type: 'item',
      url: '/create-probe',
      icon: icons.ClusterOutlined // برای پراب (چون مربوط به سرور/سیستم‌هاست)
    },
    {
      id: 'create-user',
      title: 'کاربرها',
      type: 'item',
      url: '/create-user',
      icon: icons.UserOutlined // برای یوزرها
    },
    {
      id: 'create-task',
      title: 'تسک ها',
      type: 'item',
      url: '/create-task',
      icon: icons.FileDoneOutlined // برای تسک (مثل یه لیست انجام شده)
    },
    {
      id: 'create-service',
      title: 'سرویس ها',
      type: 'item',
      url: '/create-service',
      icon: icons.AppstoreAddOutlined // برای سرویس‌ها (اپلیکیشن/سرویس جدید)
    },
    {
      id: 'task-assignment',
      title: 'تخصیص تسک',
      type: 'item',
      url: '/task-assignment',
      icon: icons.DeploymentUnitOutlined // برای تسک اساینمنت (شبکه یا تخصیص)
    },
    {
      id: 'assertion-role',
      title: 'نقش اعلان',
      type: 'item',
      url: '/assertion-role',
      icon: icons.NotificationOutlined // برای تسک اساینمنت (شبکه یا تخصیص)
    },
    {
      id: 'notification',
      title: 'تنظیم اعلان ها',
      type: 'item',
      url: '/notification',
      icon: icons.WarningOutlined   // برای تسک اساینمنت (شبکه یا تخصیص)
    },
    
  ]
};

export default dashboard;
