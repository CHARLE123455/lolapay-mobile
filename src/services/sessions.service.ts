import api, { unwrap } from '../lib/api';
import { ENDPOINTS } from '../lib/endpoints';
import type { Session } from '../lib/types';

export const sessionsService = {
    async list() {
        return unwrap<Session[]>(await api.get(ENDPOINTS.sessions.list));
    },

    async revoke(id: string) {
        await api.delete(ENDPOINTS.sessions.revoke(id));
    },
};
