import { useState } from 'react';
import { Layout, Button } from '@douyinfe/semi-ui-19';
import { IconMenu } from '@douyinfe/semi-icons';

const { Sider: SemiSider } = Layout;

const Sider = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SemiSider
      style={{
        backgroundColor: '#f8f9fa',
      }}
      collapsed={collapsed}
    >
      <div className="p-4">
        <Button
          icon={<IconMenu />}
          theme="borderless"
          onClick={() => setCollapsed(!collapsed)}
          className="mb-4"
        />
        {!collapsed && (
          <div className="text-sm text-gray-600">
            <p>侧边栏</p>
            <p className="mt-2 text-xs">可在此显示题目列表或快捷导航</p>
          </div>
        )}
      </div>
    </SemiSider>
  );
};

export default Sider;
