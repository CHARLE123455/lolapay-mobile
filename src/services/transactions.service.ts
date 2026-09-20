import api from '../lib/api';
import { ENDPOINTS } from '../lib/endpoints';
import type { ApiEnvelope, Paginated, Transaction, TransactionsQuery } from '../lib/types';

export const transactionsService = {
    async list(params: TransactionsQuery = {}): Promise<Paginated<Transaction>> {
        const { data } = await api.get<ApiEnvelope<Transaction[]>>(ENDPOINTS.transactions.list, { params });
        return { data: data.data ?? [], meta: data.meta as Paginated<Transaction>['meta'] };
    },

    async details(id: string) {
        const { data } = await api.get<ApiEnvelope<Transaction>>(ENDPOINTS.transactions.details(id));
        return data.data as Transaction;
    },
};
