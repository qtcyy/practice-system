import { useEffect } from 'react';
import { HttpContextProvider } from '@workspace/utils';
import './App.css';
import NiceModal from '@ebay/nice-modal-react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes/routes';
import { AuthInterceptor } from './interceptors';
import { useAuthStore } from './stores/authStore';
import { AuthProvider } from './context/AuthContext';

const router = createHashRouter(routes);

const App = () => {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <NiceModal.Provider>
      <HttpContextProvider fnInterceptors={[AuthInterceptor]}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </HttpContextProvider>
    </NiceModal.Provider>
  );
};

export default App;
