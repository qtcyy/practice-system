import './App.css';
import NiceModal from '@ebay/nice-modal-react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes/routes';

const router = createHashRouter(routes);

const App = () => {
  // Zustand persist 中间件会在 store 创建时自动恢复状态
  // 所有 Provider 都移到了 RootLayout 组件中，位于 Router 内部
  return (
    <NiceModal.Provider>
      <RouterProvider router={router} />
    </NiceModal.Provider>
  );
};

export default App;
