import { Nav, Dropdown, Avatar, Button } from '@douyinfe/semi-ui-19';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import type { NavItemProps } from '@douyinfe/semi-ui-19/lib/es/navigation';

const Header = () => {
  const navigate = useNavigate();
  const { username, logout } = useAuthStore();

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
    <div className="flex items-center justify-between px-6 h-16 bg-white border-b">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold text-blue-600">刷题系统</h1>
        <Nav
          mode="horizontal"
          items={navItems}
          className="border-none"
        />
      </div>

      <div className="flex items-center gap-4">
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
            <span className="ml-2">{username || '用户'}</span>
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
