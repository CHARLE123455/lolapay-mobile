import api, { unwrap } from '../lib/api';
import { ENDPOINTS } from '../lib/endpoints';
import type { Account, AccountSummary } from '../lib/types';

export const accountsService = {
  async me() {
    return unwrap<Account>(await api.get(ENDPOINTS.accounts.me));
  },

  async summary(month?: string) {
    return unwrap<AccountSummary>(await api.get(ENDPOINTS.accounts.summary, { params: month ? { month } : undefined }));
  },
};
