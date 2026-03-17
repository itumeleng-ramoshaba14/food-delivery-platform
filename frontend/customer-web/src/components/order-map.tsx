"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
} from "react-leaflet";

type Point = {
  lat: number;
  lng: number;
};

type Driver = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  vehicle: string;
};

type OrderMapProps = {
  restaurant: Point;
  customer: Point;
  driver: Driver | null;
  path: Point[];
};

const restaurantIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const customerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const driverIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function OrderMap({
  restaurant,
  customer,
  driver,
  path,
}: OrderMapProps) {
  const center: [number, number] = [restaurant.lat, restaurant.lng];
  const restaurantPosition: [number, number] = [restaurant.lat, restaurant.lng];
  const customerPosition: [number, number] = [customer.lat, customer.lng];
  const driverPosition: [number, number] | null = driver
    ? [driver.lat, driver.lng]
    : null;

  const polylinePositions: [number, number][] = path.map((p) => [p.lat, p.lng]);

  return (
    <div className="rounded-2xl overflow-hidden border shadow-sm bg-white">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "420px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={restaurantPosition} icon={restaurantIcon}>
          <Popup>Restaurant</Popup>
        </Marker>

        <Marker position={customerPosition} icon={customerIcon}>
          <Popup>Customer</Popup>
        </Marker>

        {driverPosition && driver && (
          <Marker position={driverPosition} icon={driverIcon}>
            <Popup>
              {driver.name} - {driver.vehicle}
            </Popup>
          </Marker>
        )}

        {polylinePositions.length > 0 && (
          <Polyline positions={polylinePositions} />
        )}
      </MapContainer>
    </div>
  );
}