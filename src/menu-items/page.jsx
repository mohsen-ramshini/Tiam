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
  title: 'ورود',
  type: 'group',
  children: [
    {
      id: 'login1',
      title: 'ورود به حساب کاربری',
      type: 'item',
      url: '/login',
      icon: icons.LoginOutlined,
      target: true
    },
    // {
    //   id: 'register1',
    //   title: 'ساخت حساب کاربری',
    //   type: 'item',
    //   url: '/register',
    //   icon: icons.ProfileOutlined,
    //   target: true
    // }
  ]
};

export default pages;
