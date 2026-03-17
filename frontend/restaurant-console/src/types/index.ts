export type OrderStatus = 'new' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled' | 'rejected';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  acceptedAt?: string;
  prepTime?: number;
  estimatedReady?: string;
  deliveryAddress: string;
  customerNotes?: string;
  paymentMethod: string;
  rejectReason?: string;
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelections: number;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  available: boolean;
  modifierGroups: ModifierGroup[];
  preparationTime: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  active: boolean;
}

export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  phone: string;
  email: string;
  address: string;
  imageUrl: string;
  isOnline: boolean;
  isPaused: boolean;
  operatingHours: OperatingHours[];
  minimumOrder: number;
  commissionRate: number;
  rating: number;
  totalOrders: number;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    branchCode: string;
  };
}

export interface PayoutRecord {
  id: string;
  period: string;
  grossAmount: number;
  commission: number;
  netAmount: number;
  status: 'paid' | 'pending' | 'processing';
  paidAt?: string;
}

export interface DailyStats {
  totalOrders: number;
  revenue: number;
  avgPrepTime: number;
  rating: number;
  activeOrders: number;
  newOrders: number;
  preparingOrders: number;
  readyOrders: number;
}
