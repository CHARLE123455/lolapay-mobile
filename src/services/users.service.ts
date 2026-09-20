import api, { tokenStore, unwrap } from '../lib/api';
import { ENDPOINTS } from '../lib/endpoints';
import type { Account, Card, UpdateProfileInput, User, UserSettings, UserSummary } from '../lib/types';

export interface LocalImage {
    uri: string;
    name: string;
    type: string;
}

export interface MeResponse extends User {
    account: Account | null;
    settings: UserSettings | null;
    defaultCard: Pick<Card, 'id' | 'brand' | 'last4'> | null;
}

export const usersService = {
    async me() {
        const me = unwrap<MeResponse>(await api.get(ENDPOINTS.users.me));
        await tokenStore.setUser(JSON.stringify(me));
        return me;
    },

    async updateProfile(input: UpdateProfileInput) {
        return unwrap<User>(await api.patch(ENDPOINTS.users.me, input));
    },

    async deleteAccount() {
        await api.delete(ENDPOINTS.users.me);
        await tokenStore.clear();
    },

    async settings() {
        return unwrap<UserSettings>(await api.get(ENDPOINTS.users.settings));
    },

    async updateSettings(input: Partial<UserSettings>) {
        return unwrap<UserSettings>(await api.patch(ENDPOINTS.users.settings, input));
    },

    async uploadAvatar(file: LocalImage) {
        const form = new FormData();
        form.append('avatar', { uri: file.uri, name: file.name, type: file.type } as unknown as Blob);
        return unwrap<User>(await api.post(ENDPOINTS.users.avatar, form, { headers: { 'Content-Type': 'multipart/form-data' } }));
    },

    async removeAvatar() {
        return unwrap<User>(await api.delete(ENDPOINTS.users.avatar));
    },

    async search(q: string, limit = 10) {
        return unwrap<UserSummary[]>(await api.get(ENDPOINTS.users.search, { params: { q, limit } }));
    },

    async byTag(tag: string) {
        return unwrap<UserSummary & { accountNumber: string | null }>(await api.get(ENDPOINTS.users.byTag(tag.replace(/^@/, ''))));
    },
};
