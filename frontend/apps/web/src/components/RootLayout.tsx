import { HttpContextProvider } from '@workspace/utils';
import { Outlet } from 'react-router-dom';
import { AuthInterceptor } from '../interceptors';
import { AuthProvider } from '../context/AuthContext';

/**
 * RootLayout - 根布局组件
 * 将所有 Provider 包裹在 Router 内部，以便可以使用路由 hooks
 */
const RootLayout = () => {
  return (
    <HttpContextProvider fnInterceptors={[AuthInterceptor]}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </HttpContextProvider>
  );
};

export default RootLayout;
