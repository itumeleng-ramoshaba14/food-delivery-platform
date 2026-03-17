import { mockDrivers } from "@/lib/mock-tracking";

const metrics = [
  { label: "Active Orders", value: "24" },
  { label: "Orders Today", value: "186" },
  { label: "Drivers Online", value: String(mockDrivers.length) },
  { label: "Dispatch Latency", value: "2.4 min" },
];

const recentOrders = [
  { id: "ORD-1001", restaurant: "Burger Hub", status: "Preparing", eta: "18 min" },
  { id: "ORD-1002", restaurant: "Pizza Spot", status: "Driver Assigned", eta: "12 min" },
  { id: "ORD-1003", restaurant: "Chicken Express", status: "Picked Up", eta: "8 min" },
  { id: "ORD-1004", restaurant: "Sushi Box", status: "Delivered", eta: "0 min" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-orange-600 font-semibold">
            Operations Dashboard
          </p>
          <h1 className="text-4xl font-bold mt-2">Dispatch Command Center</h1>
          <p className="text-gray-500 mt-2">
            Monitor active deliveries, driver availability, and order flow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-white rounded-2xl border shadow-sm p-6"
            >
              <p className="text-sm text-gray-500">{metric.label}</p>
              <h2 className="text-3xl font-bold mt-2">{metric.value}</h2>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4">Live Orders</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-sm text-gray-500">
                    <th className="py-3">Order ID</th>
                    <th className="py-3">Restaurant</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-4 font-medium">{order.id}</td>
                      <td className="py-4">{order.restaurant}</td>
                      <td className="py-4">{order.status}</td>
                      <td className="py-4">{order.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4">Drivers Online</h2>

            <div className="space-y-4">
              {mockDrivers.map((driver) => (
                <div key={driver.id} className="border rounded-xl p-4">
                  <p className="font-semibold">{driver.name}</p>
                  <p className="text-sm text-gray-500">{driver.vehicle}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {driver.lat.toFixed(4)}, {driver.lng.toFixed(4)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
