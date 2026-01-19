import {
  HttpClient,
  type HttpInterceptorFn,
  withInterceptors,
} from '@ngify/http';
import { createContext, useContext } from 'react';

const HttpContext = createContext<HttpClient | null>(null);

type HttpContextProviderProps = {
  children: React.ReactNode;
  fnInterceptors?: HttpInterceptorFn[];
};

export const useHttp = () => {
  const ctx = useContext(HttpContext);
  if (!ctx) {
    throw new Error('Http must use in Http Provider');
  }
  return ctx;
};

export const HttpContextProvider = (props: HttpContextProviderProps) => {
  const fnInterceptors = () => props.fnInterceptors || [];
  const http = new HttpClient(withInterceptors(fnInterceptors()));

  return (
    <HttpContext.Provider value={http}>{props.children}</HttpContext.Provider>
  );
};
