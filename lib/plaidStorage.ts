import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'fina_plaid_items';

export interface StoredPlaidItem {
  itemId: string;
  accessToken: string;
  institutionName: string;
  linkedAt: string; // ISO
}

async function readAll(): Promise<StoredPlaidItem[]> {
  const raw = await SecureStore.getItemAsync(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as StoredPlaidItem[];
}

async function writeAll(items: StoredPlaidItem[]): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(items));
}

export async function storePlaidItem(item: StoredPlaidItem): Promise<void> {
  const items = await readAll();
  const filtered = items.filter((i) => i.itemId !== item.itemId);
  await writeAll([...filtered, item]);
}

export async function loadPlaidItems(): Promise<StoredPlaidItem[]> {
  return readAll();
}

export async function removePlaidItem(itemId: string): Promise<void> {
  const items = await readAll();
  await writeAll(items.filter((i) => i.itemId !== itemId));
}

export async function getAccessToken(itemId: string): Promise<string | null> {
  const items = await readAll();
  return items.find((i) => i.itemId === itemId)?.accessToken ?? null;
}
