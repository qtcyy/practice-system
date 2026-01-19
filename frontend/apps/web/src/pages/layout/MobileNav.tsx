import { SideSheet, Nav, Avatar, Button } from '@douyinfe/semi-ui-19';
import { IconList, IconPlus } from '@douyinfe/semi-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface MobileNavProps {
  visible: boolean;
  onClose: () => void;
}

const MobileNav = ({ visible, onClose }: MobileNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, logout } = useAuthStore();

  // 导航菜单项
  const navItems = [
    {
      itemKey: 'problem-sets',
      text: '题集列表',
      icon: <IconList />,
      path: '/app',
    },
    {
      itemKey: 'create-set',
      text: '创建题集',
      icon: <IconPlus />,
      path: '/app/create-set',
    },
  ];

  // 根据当前路径判断选中项
  const getSelectedKey = () => {
    if (
      location.pathname === '/app' ||
      location.pathname.startsWith('/app/problem-set')
    ) {
      return 'problem-sets';
    }
    if (location.pathname.startsWith('/app/create-set')) {
      return 'create-set';
    }
    return 'problem-sets';
  };

  // 点击导航项
  const handleNavClick = (data: { itemKey: string }) => {
    const item = navItems.find((nav) => nav.itemKey === data.itemKey);
    if (item) {
      navigate(item.path);
      onClose(); // 关闭抽屉
    }
  };

  // 退出登录
  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <SideSheet
      visible={visible}
      onCancel={onClose}
      placement="left"
      width={280}
      closable={false}
      bodyStyle={{ padding: 0 }}
      headerStyle={{ display: 'none' }}
    >
      <div className="flex flex-col h-full">
        {/* 用户信息卡片 */}
        <div className="p-4 bg-blue-50 border-b flex items-center gap-3">
          <Avatar size="large">{username?.charAt(0) || 'U'}</Avatar>
          <div>
            <div className="font-medium text-base">{username || '用户'}</div>
            <div className="text-sm text-gray-500">欢迎回来</div>
          </div>
        </div>

        {/* 导航菜单 */}
        <div className="flex-1 overflow-auto">
          <Nav
            mode="vertical"
            items={navItems}
            selectedKeys={[getSelectedKey()]}
            onSelect={handleNavClick}
            className="mt-2"
          />
        </div>

        {/* 退出登录按钮（底部固定） */}
        <div className="p-4 border-t">
          <Button
            block
            type="danger"
            theme="light"
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </div>
      </div>
    </SideSheet>
  );
};

export default MobileNav;
