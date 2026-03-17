export type OrderStatus =
  | "ORDER_RECEIVED"
  | "PREPARING"
  | "DRIVER_ASSIGNED"
  | "PICKED_UP"
  | "DELIVERED";

export type Driver = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  vehicle: string;
};

export type LocationPoint = {
  lat: number;
  lng: number;
};

export type TrackingState = {
  orderId: string;
  status: OrderStatus;
  etaMinutes: number;
  restaurant: LocationPoint;
  customer: LocationPoint;
  driver: Driver | null;
  driverPath: LocationPoint[];
};

export const mockDrivers: Driver[] = [
  {
    id: "d1",
    name: "Sibusiso",
    lat: -26.2015,
    lng: 28.0456,
    vehicle: "Motorbike",
  },
  {
    id: "d2",
    name: "Naledi",
    lat: -26.1989,
    lng: 28.0412,
    vehicle: "Scooter",
  },
  {
    id: "d3",
    name: "Thabo",
    lat: -26.205,
    lng: 28.052,
    vehicle: "Motorbike",
  },
];

export const mockRestaurant = {
  lat: -26.2041,
  lng: 28.0473,
};

export const mockCustomer = {
  lat: -26.1952,
  lng: 28.0341,
};

function distance(a: LocationPoint, b: LocationPoint) {
  const dx = a.lat - b.lat;
  const dy = a.lng - b.lng;
  return Math.sqrt(dx * dx + dy * dy);
}

export function findClosestDriver(
  restaurant: LocationPoint,
  drivers: Driver[]
): Driver {
  return [...drivers].sort(
    (a, b) => distance(restaurant, a) - distance(restaurant, b)
  )[0];
}

export function interpolatePath(
  start: LocationPoint,
  end: LocationPoint,
  steps = 12
): LocationPoint[] {
  const path: LocationPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    path.push({
      lat: start.lat + (end.lat - start.lat) * t,
      lng: start.lng + (end.lng - start.lng) * t,
    });
  }
  return path;
}

export function buildTrackingState(orderId: string): TrackingState {
  const assignedDriver = findClosestDriver(mockRestaurant, mockDrivers);
  const driverPath = interpolatePath(mockRestaurant, mockCustomer, 14);

  return {
    orderId,
    status: "DRIVER_ASSIGNED",
    etaMinutes: 18,
    restaurant: mockRestaurant,
    customer: mockCustomer,
    driver: assignedDriver,
    driverPath,
  };
}