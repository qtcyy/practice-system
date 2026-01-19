import { Layout as SemiLayout } from '@douyinfe/semi-ui-19';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sider from './Sider';

const { Content } = SemiLayout;

const Layout = () => {
  return (
    <SemiLayout className="h-screen">
      <Header />
      <SemiLayout className="flex-1">
        <Sider />
        <Content className="p-6 overflow-auto bg-gray-50">
          <Outlet />
        </Content>
      </SemiLayout>
    </SemiLayout>
  );
};

export default Layout;
