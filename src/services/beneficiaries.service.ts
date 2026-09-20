import api, { unwrap } from '../lib/api';
import { ENDPOINTS } from '../lib/endpoints';
import type { Beneficiary, CreateBeneficiaryInput, Follower } from '../lib/types';

export const beneficiariesService = {
  async list(q?: string, limit = 50) {
    return unwrap<Beneficiary[]>(await api.get(ENDPOINTS.beneficiaries.list, { params: { q: q || undefined, limit } }));
  },

  async create(input: CreateBeneficiaryInput) {
    return unwrap<Beneficiary>(await api.post(ENDPOINTS.beneficiaries.create, input));
  },

  async update(id: string, patch: { nickname?: string | null; isFavourite?: boolean }) {
    return unwrap<Beneficiary>(await api.patch(ENDPOINTS.beneficiaries.update(id), patch));
  },

  async remove(id: string) {
    await api.delete(ENDPOINTS.beneficiaries.remove(id));
  },

  async followers() {
    return unwrap<Follower[]>(await api.get(ENDPOINTS.beneficiaries.followers));
  },
};
