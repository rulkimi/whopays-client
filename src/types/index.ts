interface Friend {
  id: number;
  user_id: number;
  name: string;
  photo_url: string;
}

interface Variation {
  variation_name: string;
  price: number;
}

interface Item {
  item_id: number;
  friends: Friend[];
  item_name: string;
  quantity: number;
  variation: Variation[];
}

interface Receipt {
  id: number;
  user_id: number;
  currency: string;
  receipt_url: string;
  restaurant_name: string;
  service_charge: number;
  tax: number;
  total_amount: number;
  friends: Friend[];

  created_at: string;
  updated_at: string;
}

interface DashboardData {
  friends: Friend[];
  receipts: Receipt[];
}