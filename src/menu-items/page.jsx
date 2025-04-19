/* eslint-disable prettier/prettier */
// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: '',
  type: 'group',
  children: [
    {
      id: 'login1',
      title: 'ورود به حساب کاربری',
      type: 'item',
      url: '/login',
      icon: icons.LoginOutlined,
      target: true // برای login مشکلی نیست چون معمولاً صفحه جداست
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


export default pages;
