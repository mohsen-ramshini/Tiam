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
    }
  ]
};


export default pages;
