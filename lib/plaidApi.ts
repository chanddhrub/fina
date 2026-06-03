import Constants from 'expo-constants';

function getApiBaseUrl(): string {
  if (__DEV__) {
    // expo-constants exposes the bundler host so the phone can reach your laptop
    const host = (Constants.expoConfig as any)?.hostUri?.split(':')[0];
    if (host) return `http://${host}:3000`;
  }
  return process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
}

export const API_BASE = getApiBaseUrl();

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function createLinkToken(userId = 'fina-user-001'): Promise<string> {
  const data = await post<{ link_token: string }>('/api/create-link-token', { userId });
  return data.link_token;
}

export async function exchangePublicToken(
  publicToken: string
): Promise<{ accessToken: string; itemId: string }> {
  const data = await post<{ access_token: string; item_id: string }>('/api/exchange-token', {
    public_token: publicToken,
  });
  return { accessToken: data.access_token, itemId: data.item_id };
}

export async function fetchPlaidAccounts(accessToken: string): Promise<{ accounts: any[] }> {
  return post('/api/accounts', { access_token: accessToken });
}

export async function fetchPlaidTransactions(
  accessToken: string
): Promise<{ transactions: any[]; accounts: any[] }> {
  return post('/api/transactions', { access_token: accessToken });
}
