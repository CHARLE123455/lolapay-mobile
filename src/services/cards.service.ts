import api, { unwrap } from '../lib/api';
import { ENDPOINTS } from '../lib/endpoints';
import type { Card } from '../lib/types';

export const cardsService = {
    async list() {
        return unwrap<Card[]>(await api.get(ENDPOINTS.cards.list));
    },

    async create(input: { brand?: 'Visa' | 'Mastercard' | 'Verve'; holderName?: string } = {}) {
        return unwrap<Card>(await api.post(ENDPOINTS.cards.create, input));
    },

    async setStatus(id: string, status: 'ACTIVE' | 'FROZEN') {
        return unwrap<Card>(await api.patch(ENDPOINTS.cards.status(id), { status }));
    },

    async setDefault(id: string) {
        return unwrap<Card>(await api.patch(ENDPOINTS.cards.setDefault(id)));
    },

    async remove(id: string) {
        await api.delete(ENDPOINTS.cards.remove(id));
    },
};
