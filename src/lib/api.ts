import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { ENDPOINTS } from './endpoints';
import { ApiError, type ApiEnvelope, type AuthResult, messageOf } from './types';

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? (Platform.OS === 'android' ? 'http://10.0.2.2:4000/api/v1' : 'http://localhost:4000/api/v1');

const ACCESS_KEY = 'lolapay.access';
const REFRESH_KEY = 'lolapay.refresh';
const USER_KEY = 'lolapay.user';

const storage = {
  get: (key: string) => (Platform.OS === 'web' ? Promise.resolve(localStorage.getItem(key)) : SecureStore.getItemAsync(key)),
  set: (key: string, value: string) => (Platform.OS === 'web' ? Promise.resolve(localStorage.setItem(key, value)) : SecureStore.setItemAsync(key, value)),
  del: (key: string) => (Platform.OS === 'web' ? Promise.resolve(localStorage.removeItem(key)) : SecureStore.deleteItemAsync(key)),
};

let accessToken: string | null = null;
let refreshToken: string | null = null;

export const tokenStore = {
  async load() {
    [accessToken, refreshToken] = await Promise.all([storage.get(ACCESS_KEY), storage.get(REFRESH_KEY)]);
    return Boolean(refreshToken);
  },
  getAccess: () => accessToken,
  getRefresh: () => refreshToken,
  async set(access: string, refresh: string) {
    accessToken = access;
    refreshToken = refresh;
    await Promise.all([storage.set(ACCESS_KEY, access), storage.set(REFRESH_KEY, refresh)]);
  },
  async clear() {
    accessToken = null;
    refreshToken = null;
    await Promise.all([storage.del(ACCESS_KEY), storage.del(REFRESH_KEY), storage.del(USER_KEY)]);
  },
  getUser: () => storage.get(USER_KEY),
  setUser: (json: string) => storage.set(USER_KEY, json),
};

const expiredListeners = new Set<() => void>();
export const onAuthExpired = (fn: () => void) => {
  expiredListeners.add(fn);
  return () => {
    expiredListeners.delete(fn);
  };
};

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Client': `LolaPayMobile/${Platform.OS}` },
  timeout: 20_000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const current = tokenStore.getRefresh();
  if (!current) return null;
  try {
    const { data } = await axios.post<ApiEnvelope<AuthResult>>(`${API_URL}${ENDPOINTS.auth.refresh}`, { refreshToken: current });
    if (!data.data) return null;
    await tokenStore.set(data.data.accessToken, data.data.refreshToken);
    return data.data.accessToken;
  } catch {
    return null;
  }
}

async function forceLogout() {
  await tokenStore.clear();
  expiredListeners.forEach((fn) => fn());
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(new ApiError('Unexpected error', 0));
    }

    const status = error.response?.status ?? 0;
    const body = error.response?.data as ApiEnvelope | undefined;
    const original = error.config as RetriableConfig | undefined;
    const isAuthRoute = original?.url?.includes('/auth/') ?? false;

    if (status === 401 && original && !original._retried && !isAuthRoute) {
      original._retried = true;
      refreshing ??= refreshAccessToken().finally(() => (refreshing = null));
      const token = await refreshing;
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
      await forceLogout();
      return Promise.reject(new ApiError(messageOf(body, 'Your session has expired.'), 401, body?.code));
    }

    if (status === 0) {
      return Promise.reject(new ApiError(`Cannot reach the API at ${API_URL}`, 0, 'NETWORK'));
    }

    return Promise.reject(new ApiError(messageOf(body), status, body?.code, body?.details));
  },
);

export const unwrap = <T>(res: AxiosResponse<ApiEnvelope<T>>): T => res.data.data as T;

export default api;
