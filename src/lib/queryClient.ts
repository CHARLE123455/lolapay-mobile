import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './types';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: (count, err) => !(err instanceof ApiError && err.status >= 400 && err.status < 500) && count < 2,
        },
        mutations: { retry: 0 },
    },
});

export const QK = {
    me: ['me'] as const,
    settings: ['me', 'settings'] as const,
    account: ['account'] as const,
    summary: (month?: string) => ['account', 'summary', month ?? 'current'] as const,
    transactions: (params?: Record<string, unknown>) => ['transactions', params ?? {}] as const,
    transaction: (id: string) => ['transactions', id] as const,
    transfers: (params?: Record<string, unknown>) => ['transfers', params ?? {}] as const,
    beneficiaries: (q?: string) => ['beneficiaries', q ?? ''] as const,
    followers: ['beneficiaries', 'followers'] as const,
    cards: ['cards'] as const,
    sessions: ['sessions'] as const,
    notifications: ['notifications'] as const,
    userSearch: (q: string) => ['users', 'search', q] as const,
    providers: ['auth', 'providers'] as const,
};
