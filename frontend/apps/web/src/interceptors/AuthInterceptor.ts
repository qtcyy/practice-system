import { HttpRequest, type HttpHandlerFn, type HttpEvent } from '@ngify/http';
import { Observable } from 'rxjs';

const TOKEN_KEY = 'access_token';

export function AuthInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(clonedReq);
  }

  return next(req);
}
