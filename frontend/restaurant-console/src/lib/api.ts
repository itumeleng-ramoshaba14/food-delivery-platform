import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

export type RestaurantUser = {
  id: string;
  email: string;
  phone?: string | null;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string | null;
};

export type RestaurantSummary = {
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

export type BackendOrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "DRIVER_ASSIGNED"
  | "PICKED_UP"
  | "EN_ROUTE"
  | "DELIVERED"
  | "CANCELLED";

export type RestaurantOrderItem = {
  menuItemId?: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal?: number;
};

export type RestaurantOrder = {
  id: string;
  restaurantName?: string;
  status: BackendOrderStatus;
  subtotal?: number;
  deliveryFee?: number;
  totalAmount: number;
  itemCount?: number;
  placedAt: string;
  items?: RestaurantOrderItem[];
  publicOrderId?: string;
  deliveryId?: string;
  publicDeliveryId?: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
};

type PaginatedResponse<T> = {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
};

type LoginResponseData = {
  token: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  user?: RestaurantUser;
};

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://food-delivery-platform-backend-ofq1.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get("restaurant_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove("restaurant_token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export async function loginRestaurant(email: string, password: string) {
  const response = await api.post<ApiEnvelope<LoginResponseData>>(
    "/api/auth/login",
    { email, password }
  );

  const data = response.data.data;

  if (!data?.token) {
    throw new Error("Login succeeded but no token was returned");
  }

  Cookies.set("restaurant_token", data.token, { expires: 1, path: "/" });

  return data;
}

export async function getCurrentRestaurantUser(): Promise<RestaurantUser> {
  const response = await api.get<ApiEnvelope<RestaurantUser>>("/api/auth/me");
  return response.data.data;
}

export async function getMyRestaurants(): Promise<RestaurantSummary[]> {
  const response = await api.get<ApiEnvelope<RestaurantSummary[]>>(
    "/api/restaurants/my-restaurants"
  );
  return response.data.data ?? [];
}

export async function getRestaurantOrders(
  restaurantId: string
): Promise<RestaurantOrder[]> {
  const response = await api.get<ApiEnvelope<PaginatedResponse<RestaurantOrder>>>(
    `/api/restaurant/orders?restaurantId=${restaurantId}&page=0&size=50`
  );

  return response.data.data?.content ?? [];
}

export async function acceptRestaurantOrder(
  orderId: string,
  prepTimeMinutes: number
) {
  const response = await api.post<ApiEnvelope<unknown>>(
    `/api/restaurant/orders/${orderId}/accept`,
    { prepTimeMinutes }
  );

  return response.data.data;
}

export async function rejectRestaurantOrder(orderId: string, reason: string) {
  const response = await api.post<ApiEnvelope<unknown>>(
    `/api/restaurant/orders/${orderId}/reject`,
    { reason }
  );

  return response.data.data;
}

export async function markOrderPreparing(orderId: string) {
  const response = await api.post<ApiEnvelope<unknown>>(
    `/api/restaurant/orders/${orderId}/preparing`
  );

  return response.data.data;
}

export async function markOrderReady(orderId: string) {
  const response = await api.post<ApiEnvelope<unknown>>(
    `/api/restaurant/orders/${orderId}/ready`
  );

  return response.data.data;
}

export default api;