/**
 * API 配置模块
 * 从环境变量读取服务器基础地址，提供 URL 拼接工具函数
 */

/**
 * 获取 API 基础地址
 * 从环境变量 VITE_API_BASE_URL 读取
 * @returns API 服务器基础地址
 * @default "http://localhost:5000"
 */
export const getBaseURL = (): string => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  if (!baseURL) {
    console.warn(
      '[API 配置] 未找到环境变量 VITE_API_BASE_URL，使用默认值: http://localhost:5000',
    );
    return 'http://localhost:5000';
  }

  return baseURL;
};

/**
 * 获取 WebSocket 基础地址
 * 从环境变量 VITE_SOCKET_BASE_URL 读取
 * @returns WebSocket 服务器基础地址
 * @default "ws://localhost:5000"
 */
export const getSocketUrl = (): string => {
  const socketUrl = import.meta.env.VITE_SOCKET_BASE_URL;

  if (!socketUrl) {
    console.warn(
      '[API 配置] 未找到环境变量 VITE_SOCKET_BASE_URL，使用默认值: ws://localhost:5000',
    );
    return 'ws://localhost:5000';
  }

  return socketUrl;
};

/**
 * 获取完整的 API URL
 * 将路径与基础地址拼接，自动处理斜杠
 * @param path API 路径（可以以 / 开头或不开头）
 * @returns 完整的 API URL
 * @example
 * getUrl("/api/users") // => "http://localhost:8080/api/users"
 * getUrl("api/users")  // => "http://localhost:8080/api/users"
 */
export const getUrl = (path: string): string => {
  const baseURL = getBaseURL();

  // 确保 path 以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // 移除 baseURL 末尾的 /（如果有）
  const normalizedBaseURL = baseURL.endsWith('/')
    ? baseURL.slice(0, -1)
    : baseURL;

  return `${normalizedBaseURL}${normalizedPath}`;
};

/**
 * API 端点常量
 * 集中管理所有 API 路径，便于维护和重构
 */
export const API_ENDPOINTS = {
  // 认证相关
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REGISTER: '/api/auth/register',
  CHECK_LOGIN: '/user/checkLogin',

  // 用户相关
  USERS: '/api/users',
  USER_DETAIL: (id: string | number) => `/api/users/${id}`,
  USER_PROFILE: '/api/users/profile',

  // 患者相关
  PATIENTS: '/api/patients',
  PATIENT_DETAIL: (id: string | number) => `/api/patients/${id}`,
  PATIENT_SEARCH: '/api/patients/search',

  // 预约相关
  RESERVATIONS: '/api/reservations',
  RESERVATION_DETAIL: (id: string | number) => `/api/reservations/${id}`,
  RESERVATION_CREATE: '/api/reservations/create',
  RESERVATION_CANCEL: (id: string | number) => `/api/reservations/${id}/cancel`,

  // 上传相关
  UPLOAD: '/api/upload',
  UPLOAD_IMAGE: '/api/upload/image',
  UPLOAD_FILE: '/api/upload/file',

  // 诊断相关
  DIAGNOSIS: '/api/diagnosis',
  DIAGNOSIS_DETAIL: (id: string | number) => `/api/diagnosis/${id}`,
  DIAGNOSIS_REPORT: (id: string | number) => `/api/diagnosis/${id}/report`,

  // 数据统计
  DASHBOARD_STATS: '/api/dashboard/stats',
  DASHBOARD_CHART: '/api/dashboard/chart',
} as const;

/**
 * 开发环境下输出当前配置（便于调试）
 */
if (import.meta.env.DEV) {
  console.log('[API 配置] 当前 API 服务器地址:', getBaseURL());
  console.log('[API 配置] 当前 Socket 服务器地址:', getSocketUrl());
}
