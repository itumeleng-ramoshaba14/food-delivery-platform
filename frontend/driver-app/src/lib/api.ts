import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

export type DriverDelivery = {
  id: string;
  orderId?: string;
  status: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  estimatedMinutes?: number;
  deliveryOtp?: string;
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
};

type LoginResponseData = {
  token: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get("driver_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove("driver_token");

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export async function loginDriver(email: string, password: string) {
  const response = await api.post<ApiEnvelope<LoginResponseData>>(
    "/api/auth/login",
    {
      email,
      password,
    }
  );

  const data = response.data.data;

  if (!data?.token) {
    throw new Error("Login succeeded but no token was returned");
  }

  Cookies.set("driver_token", data.token, { expires: 1, path: "/" });

  return data;
}

export async function getAvailableDeliveries(): Promise<DriverDelivery[]> {
  const response = await api.get<ApiEnvelope<DriverDelivery[]>>(
    "/api/driver/deliveries/available"
  );

  return response.data.data ?? [];
}

export async function getMyCurrentDeliveries(): Promise<DriverDelivery[]> {
  const response = await api.get<ApiEnvelope<DriverDelivery[]>>(
    "/api/driver/deliveries/my-current"
  );

  return response.data.data ?? [];
}

export async function getCompletedDeliveries(): Promise<DriverDelivery[]> {
  const response = await api.get<ApiEnvelope<DriverDelivery[]>>(
    "/api/driver/deliveries/completed"
  );

  return response.data.data ?? [];
}

export async function getMyDeliveries(): Promise<DriverDelivery[]> {
  const response = await api.get<ApiEnvelope<DriverDelivery[]>>(
    "/api/driver/deliveries"
  );

  return response.data.data ?? [];
}

export async function acceptDelivery(
  deliveryId: string
): Promise<DriverDelivery> {
  const response = await api.post<ApiEnvelope<DriverDelivery>>(
    `/api/driver/deliveries/${deliveryId}/accept`
  );

  return response.data.data;
}

export async function markPickedUp(
  deliveryId: string
): Promise<DriverDelivery> {
  const response = await api.post<ApiEnvelope<DriverDelivery>>(
    `/api/driver/deliveries/${deliveryId}/pickup`
  );

  return response.data.data;
}

export async function markEnRoute(
  deliveryId: string
): Promise<DriverDelivery> {
  const response = await api.post<ApiEnvelope<DriverDelivery>>(
    `/api/driver/deliveries/${deliveryId}/en-route`
  );

  return response.data.data;
}

export async function markDelivered(
  deliveryId: string
): Promise<DriverDelivery> {
  const response = await api.post<ApiEnvelope<DriverDelivery>>(
    `/api/driver/deliveries/${deliveryId}/deliver`
  );

  return response.data.data;
}

export default api;
