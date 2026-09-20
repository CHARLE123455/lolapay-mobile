import * as Crypto from 'expo-crypto';
import api, { unwrap } from '../lib/api';
import { ENDPOINTS } from '../lib/endpoints';
import type { ApiEnvelope, Paginated, SendMoneyInput, Transfer } from '../lib/types';

const newIdempotencyKey = () => Crypto.randomUUID();

export const transfersService = {
  async send(input: SendMoneyInput) {
    const idempotencyKey = input.idempotencyKey ?? newIdempotencyKey();
    return unwrap<Transfer>(
      await api.post(ENDPOINTS.transfers.send, { ...input, idempotencyKey }, { headers: { 'Idempotency-Key': idempotencyKey } }),
    );
  },

  async list(params: { page?: number; limit?: number; direction?: 'sent' | 'received' | 'all' } = {}): Promise<Paginated<Transfer>> {
    const { data } = await api.get<ApiEnvelope<Transfer[]>>(ENDPOINTS.transfers.list, { params });
    return { data: data.data ?? [], meta: data.meta as Paginated<Transfer>['meta'] };
  },

  async details(id: string) {
    return unwrap<Transfer>(await api.get(ENDPOINTS.transfers.details(id)));
  },
};
