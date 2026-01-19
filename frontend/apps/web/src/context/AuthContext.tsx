import { Notification } from '@douyinfe/semi-ui-19';
import { useHttp } from '@workspace/utils';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';
import { getUrl } from 'src/config/api';
import { useAuthStore } from 'src/stores/authStore';

type AuthContextType = {
  login: (username: string, password: string, onSuccess?: () => void) => void;
  logout: (onSuccess?: () => void) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('auth context must use in provider');
  }
  return ctx;
};

type LoginResp = {
  userId: string;
  token: string;
};

type Props = {
  children: ReactNode;
};
type LoginParam = {
  username: string;
  password: string;
  onSuccess?: () => void;
};

export const AuthProvider = ({ children }: Props) => {
  // base
  const http = useHttp();

  // state
  const [loginLoading, setLoginLoading] = useState(false);

  const { login, logout } = useAuthStore();

  // subject
  const login$Ref = useRef(new Subject<LoginParam>());

  // observer
  const loginObserver = useCallback(
    (param: LoginParam) => {
      const payload = {
        username: param.username,
        password: param.password,
      };
      return http.post<LoginResp>(getUrl('/api/User/login'), payload);
    },
    [http],
  );

  // effect
  useEffect(() => {
    const destroy$ = new Subject<void>();

    login$Ref.current
      .pipe(
        tap(() => setLoginLoading(true)),
        debounceTime(1000),
        switchMap((param) =>
          loginObserver(param).pipe(
            tap({
              next(value) {
                setLoginLoading(false);
                if (value.token) {
                  login(value.token, value.userId, param.username);
                  param.onSuccess?.();
                } else {
                  Notification.open({
                    title: '登录失败',
                    duration: 3,
                  });
                }
              },
              error(err) {
                setLoginLoading(false);
                Notification.open({
                  title: '登录失败',
                  content: err,
                  duration: 3,
                });
              },
            }),
          ),
        ),
      )
      .subscribe({
        error(err) {
          setLoginLoading(false);
        },
      });

    return () => {
      destroy$.next();
      destroy$.complete();
    };
  }, [http]);

  // funcs
  const _login = (
    username: string,
    password: string,
    onSuccess?: () => void,
  ) => {
    login$Ref.current.next({ username, password, onSuccess });
  };

  const _logout = (onSuccess?: () => void) => {};

  return (
    <AuthContext.Provider
      value={{
        login: _login,
        logout: _logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
