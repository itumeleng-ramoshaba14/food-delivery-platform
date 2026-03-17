const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://food-delivery-platform-backend-ofq1.onrender.com";
  
type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
  errors?: Record<string, string>;
};

function unwrapApiResponse<T>(json: ApiResponse<T> | T): T {
  if (
    json &&
    typeof json === "object" &&
    "data" in (json as Record<string, unknown>)
  ) {
    const wrapped = json as ApiResponse<T>;
    return wrapped.data as T;
  }

  return json as T;
}

export type Restaurant = {
  id: string;
  name: string;
  description: string;
  phone: string | null;
  email: string | null;
  addressLine1: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  cuisineType: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  rating: number;
  totalRatings: number;
  minOrderAmount: number;
  avgPrepTimeMinutes: number;
  isActive: boolean;
  isOpen: boolean;
  openingTime: string | null;
  closingTime: string | null;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isActive: boolean;
  sortOrder: number;
};

export type OrderItemDetails = {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderResponse = {
  id: string;
  publicOrderId?: string;
  deliveryId?: string;
  publicDeliveryId?: string;
  status: string;
  subtotal?: number;
  deliveryFee?: number;
  totalAmount: number;
  placedAt: string;
  restaurantName?: string;
  deliveryInstructions?: string;
  items?: OrderItemDetails[];
};

export type CreateOrderItemRequest = {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
};

export type CreateOrderRequest = {
  restaurantId: string;
  deliveryAddressId: string;
  deliveryInstructions?: string;
  tipAmount?: number;
  items: CreateOrderItemRequest[];
};

export type CreateOrderResponse = {
  id: string;
  publicOrderId?: string;
  deliveryId?: string;
  publicDeliveryId?: string;
  status: string;
  subtotal?: number;
  deliveryFee?: number;
  totalAmount: number;
  placedAt?: string;
  restaurantName?: string;
  deliveryInstructions?: string;
  items?: OrderItemDetails[];
};

export type OrderDetails = {
  id: string;
  publicOrderId?: string;
  deliveryId?: string;
  publicDeliveryId?: string;
  status: string;
  subtotal?: number;
  deliveryFee?: number;
  totalAmount?: number;
  placedAt?: string;
  restaurantName?: string;
  deliveryAddressId?: string;
  deliveryInstructions?: string;
  items?: OrderItemDetails[];
};

export function getCustomerToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("customerToken");
}

export async function getRestaurants(): Promise<Restaurant[]> {
  const res = await fetch(`${API_BASE_URL}/api/restaurants`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch restaurants");
  }

  const json = await res.json();
  return unwrapApiResponse<Restaurant[]>(json);
}

export async function getRestaurantMenu(restaurantId: string): Promise<MenuItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/menu`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch menu");
  }

  const json = await res.json();
  return unwrapApiResponse<MenuItem[]>(json);
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message || json?.error || "Login failed");
  }

  const token = json?.data?.token ?? json?.token;

  if (!token) {
    throw new Error("Login succeeded but no token was returned");
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("customerToken", token);
  }

  return json;
}

export async function placeOrder(params: {
  token: string;
  restaurantId: string;
  deliveryAddressId: string;
  items: { menuItemId: string; quantity: number; specialInstructions?: string }[];
  deliveryInstructions?: string;
  tipAmount?: number;
}): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({
      restaurantId: params.restaurantId,
      deliveryAddressId: params.deliveryAddressId,
      deliveryInstructions: params.deliveryInstructions ?? "",
      tipAmount: params.tipAmount ?? 0,
      items: params.items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions ?? "",
      })),
    }),
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const details = json?.errors
      ? Object.values(json.errors).join(", ")
      : json?.message || json?.error || "Failed to place order";

    throw new Error(String(details));
  }

  return unwrapApiResponse<CreateOrderResponse>(json);
}

export async function createOrder(
  payload: CreateOrderRequest
): Promise<CreateOrderResponse> {
  const token = getCustomerToken();

  if (!token) {
    throw new Error("No customer token found. Please log in first.");
  }

  return placeOrder({
    token,
    restaurantId: payload.restaurantId,
    deliveryAddressId: payload.deliveryAddressId,
    deliveryInstructions: payload.deliveryInstructions,
    tipAmount: payload.tipAmount,
    items: payload.items,
  });
}

export async function getOrder(
  token: string,
  orderId: string
): Promise<OrderDetails> {
  const res = await fetch(`${API_BASE_URL}/api/orders/track/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.message || json?.error || "Failed to fetch order"
    );
  }

  return unwrapApiResponse<OrderDetails>(json);
}