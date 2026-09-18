
export const ENDPOINTS = {
    auth: {
        register: `/auth/register`,
        login: `/auth/login`,
        refresh: `/auth/refresh`,
        logout: `/auth/logout`,
        logoutAll: `/auth/logout-all`,
        changePassword: `/auth/change-password`,
        googleToken: `/auth/google/token`,
        providers: `/auth/providers`,
    },

    users: {
        me: `/users/me`,
        settings: `/users/me/settings`,
        avatar: `/users/me/avatar`,
        search: `/users/search`,
        byTag: (tag: string) => `/users/${tag}`,
    },

    accounts: {
        me: `/accounts/me`,
        summary: `/accounts/me/summary`,
    },

    transactions: {
        list: `/transactions`,
        details: (id: string) => `/transactions/${id}`,
    },

    transfers: {
        send: `/transfers`,
        list: `/transfers`,
        details: (id: string) => `/transfers/${id}`,
    },

    beneficiaries: {
        list: `/beneficiaries`,
        create: `/beneficiaries`,
        followers: `/beneficiaries/followers`,
        update: (id: string) => `/beneficiaries/${id}`,
        remove: (id: string) => `/beneficiaries/${id}`,
    },

    cards: {
        list: `/cards`,
        create: `/cards`,
        status: (id: string) => `/cards/${id}/status`,
        setDefault: (id: string) => `/cards/${id}/default`,
        remove: (id: string) => `/cards/${id}`,
    },

    sessions: {
        list: `/sessions`,
        revoke: (id: string) => `/sessions/${id}`,
    },

    notifications: {
        list: `/notifications`,
        readAll: `/notifications/read-all`,
        read: (id: string) => `/notifications/${id}/read`,
    },

    health: `/health`,
} as const;
