import { useState } from 'react';
import { Nav, Dropdown, Avatar, Button } from '@douyinfe/semi-ui-19';
import { IconMenu } from '@douyinfe/semi-icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import MobileNav from './MobileNav';
import type { NavItemProps } from '@douyinfe/semi-ui-19/lib/es/navigation';

const Header = () => {
  const navigate = useNavigate();
  const { username, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItemProps[] = [
    {
      itemKey: 'problem-sets',
      text: '题集列表',
      onClick: () => navigate('/app'),
    },
    {
      itemKey: 'create-set',
      text: '创建题集',
      onClick: () => navigate('/app/create-set'),
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-300 flex items-center px-4 md:px-6 flex-shrink-0">
        {/* 左侧区域 */}
        <div className="flex items-center gap-4 md:gap-8 border-none">
          <h1 className="text-xl font-bold text-blue-600">刷题系统</h1>
          {/* 桌面端导航：大于等于 768px 显示 */}
          <Nav
            mode="horizontal"
            items={navItems}
            className="hidden md:flex border-none"
          />
        </div>

        {/* 右侧区域 */}
        <div className="ml-auto flex items-center gap-2 md:gap-4">
          {/* 用户下拉菜单 */}
          <Dropdown
            trigger="click"
            position="bottomRight"
            render={
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout}>退出登录</Dropdown.Item>
              </Dropdown.Menu>
            }
          >
            <Button theme="borderless">
              <Avatar size="small">{username?.charAt(0) || 'U'}</Avatar>
              <span className="ml-2 hidden sm:inline">
                {username || '用户'}
              </span>
            </Button>
          </Dropdown>

          {/* 汉堡菜单按钮：小于 768px 显示 */}
          <Button
            icon={<IconMenu />}
            theme="borderless"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden"
            aria-label="打开菜单"
          />
        </div>
      </header>

      {/* 移动端抽屉导航 */}
      <MobileNav
        visible={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

export default Header;
