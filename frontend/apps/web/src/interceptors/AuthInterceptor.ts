import { HttpRequest, type HttpHandlerFn, type HttpEvent } from '@ngify/http';
import { Observable } from 'rxjs';
import { useAuthStore } from '../stores/authStore';

export function AuthInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  // 从 Zustand store 读取 token（单一数据源）
  const token = useAuthStore.getState().token;

  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(clonedReq);
  }

  return next(req);
}
