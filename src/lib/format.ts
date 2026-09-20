const symbols: Record<string, string> = { NGN: '₦', USD: '$', GBP: '£', EUR: '€' };

const withCommas = (n: number) => {
    const [int = '0', dec = '00'] = Math.abs(n).toFixed(2).split('.');
    return `${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${dec}`;
};

export const formatMoney = (value: string | number, currency = 'NGN') => {
    const n = Number(value);
    return `${n < 0 ? '-' : ''}${symbols[currency] ?? `${currency} `}${withCommas(n)}`;
};

export const formatSigned = (signedAmount: string, currency = 'NGN') => {
    const n = Number(signedAmount);
    return `${n >= 0 ? '+' : '-'}${symbols[currency] ?? `${currency} `}${withCommas(n)}`;
};

export const formatCompact = (value: number, currency = 'NGN') => formatMoney(value, currency).replace(/\.00$/, '');

export const formatWhen = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
    if (sameDay(d, now)) return `Today, ${time}`;
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (sameDay(d, yesterday)) return `Yesterday, ${time}`;
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`;
};

export const formatDateLong = (iso: string) => new Date(iso).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });

export const initials = (first: string, last: string) => `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();

export const maskAccount = (n: string) => `${n.slice(0, 3)} *** ${n.slice(-4)}`;
