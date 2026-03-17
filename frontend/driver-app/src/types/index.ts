export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar?: string;
  rating: number;
  totalDeliveries: number;
  vehicle: Vehicle;
  documents: Document[];
  isOnline: boolean;
  currentLocation: LatLng;
  joinedDate: string;
}

export interface Vehicle {
  type: "motorcycle" | "bicycle" | "car" | "scooter";
  make: string;
  model: string;
  plate: string;
  color: string;
}

export interface Document {
  type: string;
  status: "verified" | "pending" | "expired" | "rejected";
  expiryDate?: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface DeliveryOffer {
  id: string;
  restaurant: {
    name: string;
    address: string;
    location: LatLng;
    phone: string;
  };
  customer: {
    name: string;
    area: string;
    address: string;
    location: LatLng;
    phone: string;
  };
  distanceToPickup: number; // km
  distancePickupToDropoff: number; // km
  estimatedPay: number;
  estimatedTip: number;
  estimatedTime: number; // minutes
  items: OrderItem[];
  specialInstructions?: string;
  orderId: string;
  expiresAt: number; // timestamp
}

export interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

export type DeliveryStep =
  | "navigate_to_restaurant"
  | "at_restaurant"
  | "navigate_to_customer"
  | "deliver"
  | "completed";

export interface ActiveDelivery {
  id: string;
  orderId: string;
  currentStep: DeliveryStep;
  restaurant: {
    name: string;
    address: string;
    location: LatLng;
    phone: string;
  };
  customer: {
    name: string;
    area: string;
    address: string;
    location: LatLng;
    phone: string;
    deliveryInstructions?: string;
  };
  items: OrderItem[];
  specialInstructions?: string;
  pickupCode?: string;
  deliveryOtp?: string;
  estimatedPay: number;
  estimatedTip: number;
  distanceToPickup: number;
  distancePickupToDropoff: number;
  estimatedTime: number;
  acceptedAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

export interface CompletedDelivery {
  id: string;
  orderId: string;
  restaurant: {
    name: string;
    address: string;
  };
  customer: {
    area: string;
  };
  earnings: {
    deliveryFee: number;
    tip: number;
    bonus: number;
    total: number;
  };
  distance: number;
  duration: number; // minutes
  completedAt: string;
  rating?: number;
}

export interface EarningsData {
  period: "today" | "week" | "month";
  deliveryFees: number;
  tips: number;
  incentives: number;
  total: number;
  deliveryCount: number;
  hoursOnline: number;
  earningsPerHour: number;
}

export interface Payout {
  id: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "processing";
  method: string;
}
