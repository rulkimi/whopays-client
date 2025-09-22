export interface Friend {
  id: number;
  user_id: number;
  name: string;
  photo_url: string;
}

export interface Variation {
  variation_name: string;
  price: number;
}

export interface Item {
  item_id: number;
  friends: Friend[];
  item_name: string;
  quantity: number;
  unit_price: number;
  variation: Variation[];
}

export interface Receipt {
  id: number;
  user_id: number;
  currency: string;
  receipt_url: string;
  restaurant_name: string;
  service_charge: number;
  tax: number;
  total_amount: number;
  friends: Friend[];
  items: Item[];

  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  friends: Friend[];
  receipts: Receipt[];
}

export interface Base64File {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  base64: string;
}

export interface ReceiptSplitsFriendItem {
  item_id: number;
  item_name: string;
  quantity: number;
  unit_total: number;
  line_total: number;
  share: number;
}

export interface ReceiptSplitsTotalsPerFriend {
  id: number; // friend id
  name: string; // friend name
  photo_url?: string;
  subtotal: number;
  tax: number;
  service_charge: number;
  total: number;
  items: ReceiptSplitsFriendItem[];
}

export interface ReceiptSplitsItemFriendShare {
  id: number;
  name: string;
  share: number;
}

export interface ReceiptSplitsItem {
  item_id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  variations: unknown[]; // structure not used here; keeping as unknown to match payload
  unit_total: number;
  line_total: number;
  friends: ReceiptSplitsItemFriendShare[];
}

export interface ReceiptSplitsSummary {
  subtotal: number;
  tax: number;
  service_charge: number;
  total: number;
}

export interface ReceiptSplitsResponse {
  receipt_id: number;
  currency: string;
  totals: ReceiptSplitsTotalsPerFriend[];
  items: ReceiptSplitsItem[];
  summary: ReceiptSplitsSummary;
  note: string;
}
