import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '../lib/queryClient';
import type { LocalImage } from '../services/users.service';
import type { CreateBeneficiaryInput, SendMoneyInput, TransactionsQuery, UpdateProfileInput, UserSettings } from '../lib/types';
import {
  accountsService,
  authService,
  beneficiariesService,
  cardsService,
  notificationsService,
  sessionsService,
  transactionsService,
  transfersService,
  usersService,
} from '../services';

export const useAccountSummary = (month?: string) => useQuery({ queryKey: QK.summary(month), queryFn: () => accountsService.summary(month) });
export const useAccount = () => useQuery({ queryKey: QK.account, queryFn: accountsService.me });

export const useMe = () => useQuery({ queryKey: QK.me, queryFn: usersService.me });
export const useUserSearch = (q: string) =>
  useQuery({ queryKey: QK.userSearch(q), queryFn: () => usersService.search(q), enabled: q.trim().length >= 2, staleTime: 10_000 });
export const useSettings = () => useQuery({ queryKey: QK.settings, queryFn: usersService.settings });
export const useAuthProviders = () => useQuery({ queryKey: QK.providers, queryFn: authService.providers, staleTime: Infinity });

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => usersService.updateProfile(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.me }),
  });
}
export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<UserSettings>) => usersService.updateSettings(input),
    onSuccess: (settings) => qc.setQueryData(QK.settings, settings),
  });
}
export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (file: LocalImage) => usersService.uploadAvatar(file), onSuccess: () => qc.invalidateQueries({ queryKey: QK.me }) });
}

export const useTransactions = (params: TransactionsQuery = {}) =>
  useQuery({ queryKey: QK.transactions(params as Record<string, unknown>), queryFn: () => transactionsService.list(params), placeholderData: (prev) => prev });
export const useTransaction = (id: string) => useQuery({ queryKey: QK.transaction(id), queryFn: () => transactionsService.details(id), enabled: Boolean(id) });

export function useSendMoney() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SendMoneyInput) => transfersService.send(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['account'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['transfers'] });
      qc.invalidateQueries({ queryKey: ['beneficiaries'] });
    },
  });
}

export const useBeneficiaries = (q?: string) => useQuery({ queryKey: QK.beneficiaries(q), queryFn: () => beneficiariesService.list(q) });
export const useFollowers = () => useQuery({ queryKey: QK.followers, queryFn: beneficiariesService.followers });

export function useBeneficiaryMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['beneficiaries'] });
  return {
    add: useMutation({ mutationFn: (input: CreateBeneficiaryInput) => beneficiariesService.create(input), onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, ...patch }: { id: string; nickname?: string | null; isFavourite?: boolean }) => beneficiariesService.update(id, patch),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: (id: string) => beneficiariesService.remove(id), onSuccess: invalidate }),
  };
}

export const useCards = () => useQuery({ queryKey: QK.cards, queryFn: cardsService.list });
export function useCardMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: QK.cards });
    qc.invalidateQueries({ queryKey: ['account'] });
  };
  return {
    create: useMutation({ mutationFn: cardsService.create, onSuccess: invalidate }),
    setStatus: useMutation({ mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'FROZEN' }) => cardsService.setStatus(id, status), onSuccess: invalidate }),
    setDefault: useMutation({ mutationFn: (id: string) => cardsService.setDefault(id), onSuccess: invalidate }),
    remove: useMutation({ mutationFn: (id: string) => cardsService.remove(id), onSuccess: invalidate }),
  };
}

export const useSessions = () => useQuery({ queryKey: QK.sessions, queryFn: sessionsService.list });
export function useRevokeSession() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => sessionsService.revoke(id), onSuccess: () => qc.invalidateQueries({ queryKey: QK.sessions }) });
}
export const useChangePassword = () => useMutation({ mutationFn: authService.changePassword });

export const useNotifications = () => useQuery({ queryKey: QK.notifications, queryFn: () => notificationsService.list({ limit: 30 }), refetchInterval: 30_000 });
export function useNotificationMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: QK.notifications });
    qc.invalidateQueries({ queryKey: ['account'] });
  };
  return {
    markRead: useMutation({ mutationFn: notificationsService.markRead, onSuccess: invalidate }),
    markAllRead: useMutation({ mutationFn: notificationsService.markAllRead, onSuccess: invalidate }),
  };
}
