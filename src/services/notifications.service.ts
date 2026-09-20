import api from '../lib/api';
import { ENDPOINTS } from '../lib/endpoints';
import type { ApiEnvelope, Notification } from '../lib/types';

export const notificationsService = {
    async list(params: { unreadOnly?: boolean; limit?: number } = {}) {
        const { data } = await api.get<ApiEnvelope<Notification[]>>(ENDPOINTS.notifications.list, {
            params: { unreadOnly: params.unreadOnly ? 'true' : undefined, limit: params.limit },
        });
        return { data: data.data ?? [], unread: Number(data.meta?.['unread'] ?? 0) };
    },

    async markRead(id: string) {
        await api.patch(ENDPOINTS.notifications.read(id));
    },

    async markAllRead() {
        await api.post(ENDPOINTS.notifications.readAll);
    },
};
