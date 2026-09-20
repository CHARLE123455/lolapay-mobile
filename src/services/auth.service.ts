import api, { tokenStore, unwrap } from '../lib/api';
import { ENDPOINTS } from '../lib/endpoints';
import type { AuthProviders, AuthResult, ChangePasswordInput, LoginInput, RegisterInput, User } from '../lib/types';

async function persist(result: AuthResult): Promise<AuthResult> {
  await tokenStore.set(result.accessToken, result.refreshToken);
  await tokenStore.setUser(JSON.stringify(result.user));
  return result;
}

export const authService = {
  async login(input: LoginInput) {
    return persist(unwrap<AuthResult>(await api.post(ENDPOINTS.auth.login, input)));
  },

  async register(input: RegisterInput) {
    return persist(unwrap<AuthResult>(await api.post(ENDPOINTS.auth.register, input)));
  },

  async loginWithGoogle(idToken: string) {
    return persist(unwrap<AuthResult>(await api.post(ENDPOINTS.auth.googleToken, { idToken })));
  },

  async logout() {
    const refreshToken = tokenStore.getRefresh();
    try {
      if (refreshToken) await api.post(ENDPOINTS.auth.logout, { refreshToken });
    } finally {
      await tokenStore.clear();
    }
  },

  async logoutAll() {
    try {
      await api.post(ENDPOINTS.auth.logoutAll);
    } finally {
      await tokenStore.clear();
    }
  },

  async changePassword(input: ChangePasswordInput) {
    await api.post(ENDPOINTS.auth.changePassword, input);
  },

  async providers() {
    return unwrap<AuthProviders>(await api.get(ENDPOINTS.auth.providers));
  },

  async cachedUser(): Promise<User | null> {
    const raw = await tokenStore.getUser();
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  restoreSession: () => tokenStore.load(),
};
