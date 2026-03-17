// ===== Enums & Constants =====
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled' | 'refunded';
export type UserRole = 'customer' | 'driver' | 'restaurant_staff' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';
export type DriverStatus = 'online' | 'offline' | 'on_delivery';
export type RestaurantStatus = 'active' | 'inactive' | 'suspended';
export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketCategory = 'order_issue' | 'payment' | 'delivery' | 'account' | 'restaurant' | 'other';
export type PromotionType = 'percentage' | 'fixed' | 'free_delivery';
export type PromotionStatus = 'active' | 'inactive' | 'expired';

// ===== Core Models =====
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

export interface Customer extends User {
  role: 'customer';
  totalOrders: number;
  totalSpent: number;
}

export interface Driver extends User {
  role: 'driver';
  vehicleType: string;
  vehiclePlate: string;
  driverStatus: DriverStatus;
  rating: number;
  totalDeliveries: number;
  isVerified: boolean;
  documentsUrl?: string;
  earnings: number;
}

export interface RestaurantStaff extends User {
  role: 'restaurant_staff';
  restaurantId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  cuisine: string;
  rating: number;
  ordersCount: number;
  commissionRate: number;
  status: RestaurantStatus;
  isOpen: boolean;
  address: string;
  imageUrl?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface OrderEvent {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  notes?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  driverId?: string;
  driverName?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  vat: number;
  discount: number;
  total: number;
  pickupAddress: string;
  dropoffAddress: string;
  distance: number;
  otp?: string;
  proofOfDelivery?: string;
  placedAt: string;
  confirmedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  estimatedDeliveryTime?: string;
  events: OrderEvent[];
  supportTicketIds: string[];
}

export interface Promotion {
  id: string;
  code: string;
  type: PromotionType;
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  status: PromotionStatus;
  restaurantId?: string;
  restaurantName?: string;
  createdAt: string;
}

export interface RestaurantPayout {
  id: string;
  restaurantId: string;
  restaurantName: string;
  period: string;
  orderCount: number;
  gross: number;
  commission: number;
  net: number;
  status: PayoutStatus;
  processedAt?: string;
}

export interface DriverPayout {
  id: string;
  driverId: string;
  driverName: string;
  period: string;
  deliveries: number;
  earnings: number;
  tips: number;
  incentives: number;
  total: number;
  status: PayoutStatus;
  processedAt?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  orderId?: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  message: string;
  timestamp: string;
}

export interface DashboardKPIs {
  totalOrdersToday: number;
  totalOrdersTrend: number;
  revenueToday: number;
  revenueTrend: number;
  activeDrivers: number;
  activeDriversTrend: number;
  activeRestaurants: number;
  activeRestaurantsTrend: number;
  avgDeliveryTime: number;
  avgDeliveryTimeTrend: number;
  cancellationRate: number;
  cancellationRateTrend: number;
}

export interface ActivityFeedItem {
  id: string;
  type: 'order_placed' | 'driver_assigned' | 'order_delivered' | 'order_cancelled' | 'restaurant_joined' | 'driver_verified';
  message: string;
  timestamp: string;
  orderId?: string;
}

export interface PlatformHealth {
  ordersPerHour: number[];
  labels: string[];
}
