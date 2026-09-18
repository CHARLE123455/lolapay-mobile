export interface ApiEnvelope<T = unknown> {
    success: boolean;
    data?: T;
    meta?: Record<string, unknown>;
    message?: string;
    code?: string;
    details?: FieldError[];
}

export interface FieldError {
    path: string;
    message: string;
}

export interface Paginated<T> {
    data: T[];
    meta: { page: number; limit: number; total: number; totalPages: number };
}

export class ApiError extends Error {
    readonly status: number;
    readonly code: string | undefined;
    readonly details: FieldError[] | undefined;

    constructor(message: string, status: number, code?: string, details?: FieldError[]) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
    }

    fieldError(path: string): string | undefined {
        return this.details?.find((d) => d.path === path)?.message;
    }
}

export function messageOf(body: ApiEnvelope | undefined, fallback = 'Something went wrong. Please try again.') {
    if (body?.details?.length) return body.details.map((d) => d.message).join(' ');
    return body?.message ?? fallback;
}


export interface User {
    id: string;
    email: string;
    tag: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string | null;
    avatarUrl: string | null;
    provider: string;
    hasPassword: boolean;
    createdAt: string;
}

export interface UserSummary {
    id: string;
    tag: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatarUrl: string | null;
}

export interface AuthResult {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}

export interface Account {
    id: string;
    accountNumber: string;
    currency: string;
    balance: string;
    updatedAt: string;
}

export interface AccountSummary {
    currency: string;
    accountNumber: string;
    totalBalance: string;
    sentThisMonth: string;
    sentCount: number;
    receivedThisMonth: string;
    receivedCount: number;
    activeCards: number;
    primaryCard: { id: string; brand: string; last4: string } | null;
    unreadNotifications: number;
    beneficiaries: number;
    periodStart: string;
    periodEnd: string;
}

export type TransactionType = 'CREDIT' | 'DEBIT';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: string;
    signedAmount: string;
    balanceAfter: string;
    description: string;
    counterparty: { id: string; name: string | null } | null;
    reference: string | null;
    transferId: string | null;
    status: string;
    note: string | null;
    createdAt: string;
}

export interface Transfer {
    id: string;
    reference: string;
    amount: string;
    currency: string;
    note: string | null;
    status: string;
    direction: 'sent' | 'received';
    sender: UserSummary;
    recipient: UserSummary;
    createdAt: string;
    newBalance?: string;
}

export interface Beneficiary {
    id: string;
    nickname: string | null;
    isFavourite: boolean;
    createdAt: string;
    displayName: string;
    user: UserSummary & { accountNumber: string | null };
    lastTransfer: { amount: string; at: string } | null;
}

export interface Follower {
    id: string;
    since: string;
    user: UserSummary;
}

export type CardStatus = 'ACTIVE' | 'FROZEN' | 'CANCELLED';

export interface Card {
    id: string;
    brand: string;
    last4: string;
    maskedNumber: string;
    holderName: string;
    expMonth: number;
    expYear: number;
    expiry: string;
    status: CardStatus;
    isDefault: boolean;
    createdAt: string;
}

export interface Session {
    id: string;
    device: string;
    userAgent: string | null;
    ipAddress: string | null;
    createdAt: string;
    lastUsedAt: string;
    expiresAt: string;
    isCurrent: boolean;
}

export interface Notification {
    id: string;
    type: string;
    title: string;
    body: string;
    data: Record<string, unknown> | null;
    isRead: boolean;
    createdAt: string;
}

export interface UserSettings {
    currency: 'NGN' | 'USD' | 'GBP' | 'EUR';
    language: 'en' | 'fr' | 'yo' | 'ha' | 'ig';
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    pushNotifications: boolean;
    transactionAlerts: boolean;
    marketingEmails: boolean;
    twoFactorEnabled: boolean;
    updatedAt: string;
}

export interface AuthProviders {
    local: boolean;
    google: boolean;
    googleClientId: string | null;
}

export interface LoginInput {
    email: string;
    password: string;
}
export interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    tag?: string;
}
export interface ChangePasswordInput {
    currentPassword: string;
    newPassword: string;
}
export interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    tag?: string;
}
export interface SendMoneyInput {
    amount: number;
    note?: string;
    recipientId?: string;
    recipientTag?: string;
    accountNumber?: string;
    idempotencyKey?: string;
}
export interface TransactionsQuery {
    page?: number;
    limit?: number;
    type?: TransactionType;
    from?: string;
    to?: string;
    q?: string;
}
export interface CreateBeneficiaryInput {
    userId?: string;
    tag?: string;
    accountNumber?: string;
    nickname?: string;
}

export function errorMessage(e: unknown, fallback = 'Something went wrong. Please try again.'): string {
    if (e instanceof ApiError || e instanceof Error) return e.message || fallback;
    return fallback;
}
