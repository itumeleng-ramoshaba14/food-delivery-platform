import {
  Order, User, Customer, Driver, RestaurantStaff, Restaurant,
  Promotion, RestaurantPayout, DriverPayout, SupportTicket,
  DashboardKPIs, ActivityFeedItem, PlatformHealth,
} from '@/types';

// ===== Dashboard KPIs =====
export const mockKPIs: DashboardKPIs = {
  totalOrdersToday: 847,
  totalOrdersTrend: 12.5,
  revenueToday: 42350.00,
  revenueTrend: 8.3,
  activeDrivers: 63,
  activeDriversTrend: -2.1,
  activeRestaurants: 45,
  activeRestaurantsTrend: 4.5,
  avgDeliveryTime: 28,
  avgDeliveryTimeTrend: -3.2,
  cancellationRate: 4.2,
  cancellationRateTrend: -0.8,
};

// ===== Activity Feed =====
export const mockActivityFeed: ActivityFeedItem[] = [
  { id: 'af-1', type: 'order_placed', message: 'New order #ORD-1026 placed by Thabo M. at Nando\'s Sandton', timestamp: '2026-03-06T00:18:00Z', orderId: 'ORD-1026' },
  { id: 'af-2', type: 'driver_assigned', message: 'Driver Sipho K. assigned to order #ORD-1025', timestamp: '2026-03-06T00:15:00Z', orderId: 'ORD-1025' },
  { id: 'af-3', type: 'order_delivered', message: 'Order #ORD-1020 delivered successfully', timestamp: '2026-03-06T00:12:00Z', orderId: 'ORD-1020' },
  { id: 'af-4', type: 'order_cancelled', message: 'Order #ORD-1019 cancelled by customer', timestamp: '2026-03-06T00:10:00Z', orderId: 'ORD-1019' },
  { id: 'af-5', type: 'order_placed', message: 'New order #ORD-1025 placed by Lerato N. at Ocean Basket', timestamp: '2026-03-06T00:08:00Z', orderId: 'ORD-1025' },
  { id: 'af-6', type: 'driver_verified', message: 'Driver Bongani M. passed verification', timestamp: '2026-03-06T00:05:00Z' },
  { id: 'af-7', type: 'order_delivered', message: 'Order #ORD-1018 delivered successfully', timestamp: '2026-03-06T00:02:00Z', orderId: 'ORD-1018' },
  { id: 'af-8', type: 'restaurant_joined', message: 'New restaurant "Kota Joe\'s" registered', timestamp: '2026-03-05T23:55:00Z' },
  { id: 'af-9', type: 'order_placed', message: 'New order #ORD-1024 placed by Naledi S. at Steers', timestamp: '2026-03-05T23:50:00Z', orderId: 'ORD-1024' },
  { id: 'af-10', type: 'driver_assigned', message: 'Driver Tshepo L. assigned to order #ORD-1024', timestamp: '2026-03-05T23:48:00Z', orderId: 'ORD-1024' },
];

// ===== Platform Health =====
export const mockPlatformHealth: PlatformHealth = {
  ordersPerHour: [12, 18, 25, 38, 52, 65, 78, 85, 92, 88, 75, 60, 45, 55, 70, 82, 90, 95, 88, 72, 58, 40, 28, 15],
  labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
};

// ===== Orders =====
export const mockOrders: Order[] = [
  {
    id: 'ORD-1001', customerId: 'USR-001', customerName: 'Thabo Molefe', customerPhone: '+27 71 234 5678',
    restaurantId: 'REST-001', restaurantName: "Nando's Sandton", driverId: 'DRV-001', driverName: 'Sipho Khumalo',
    status: 'delivered', items: [
      { id: 'item-1', name: 'Full Chicken', quantity: 1, price: 169.90 },
      { id: 'item-2', name: 'Regular Chips', quantity: 2, price: 34.90 },
      { id: 'item-3', name: 'Coleslaw', quantity: 1, price: 24.90 },
    ],
    subtotal: 264.60, deliveryFee: 25.00, serviceFee: 13.23, vat: 45.42, discount: 0, total: 348.25,
    pickupAddress: '32 Maude St, Sandton, 2196', dropoffAddress: '15 Rivonia Rd, Sandton, 2196',
    distance: 3.2, otp: '4521', proofOfDelivery: 'delivered_photo_url',
    placedAt: '2026-03-05T18:30:00Z', confirmedAt: '2026-03-05T18:32:00Z',
    pickedUpAt: '2026-03-05T18:55:00Z', deliveredAt: '2026-03-05T19:15:00Z',
    estimatedDeliveryTime: '2026-03-05T19:10:00Z',
    events: [
      { id: 'ev-1', timestamp: '2026-03-05T18:30:00Z', event: 'Order Placed', actor: 'Thabo Molefe', notes: 'Order placed via mobile app' },
      { id: 'ev-2', timestamp: '2026-03-05T18:32:00Z', event: 'Order Confirmed', actor: "Nando's Sandton", notes: 'Restaurant confirmed, estimated 20 min' },
      { id: 'ev-3', timestamp: '2026-03-05T18:45:00Z', event: 'Driver Assigned', actor: 'System', notes: 'Sipho Khumalo assigned (2.1 km away)' },
      { id: 'ev-4', timestamp: '2026-03-05T18:55:00Z', event: 'Picked Up', actor: 'Sipho Khumalo', notes: 'OTP verified' },
      { id: 'ev-5', timestamp: '2026-03-05T19:15:00Z', event: 'Delivered', actor: 'Sipho Khumalo', notes: 'Delivered to customer' },
    ],
    supportTicketIds: [],
  },
  {
    id: 'ORD-1002', customerId: 'USR-002', customerName: 'Lerato Nkosi', customerPhone: '+27 82 345 6789',
    restaurantId: 'REST-002', restaurantName: 'Ocean Basket Rosebank', driverId: 'DRV-002', driverName: 'Tshepo Langa',
    status: 'in_transit', items: [
      { id: 'item-4', name: 'Seafood Platter for 2', quantity: 1, price: 349.00 },
      { id: 'item-5', name: 'Calamari Starter', quantity: 1, price: 89.00 },
    ],
    subtotal: 438.00, deliveryFee: 30.00, serviceFee: 21.90, vat: 73.49, discount: 50.00, total: 513.39,
    pickupAddress: '121 Oxford Rd, Rosebank, 2196', dropoffAddress: '45 Jan Smuts Ave, Parktown, 2193',
    distance: 5.8, otp: '7823',
    placedAt: '2026-03-06T00:05:00Z', confirmedAt: '2026-03-06T00:08:00Z', pickedUpAt: '2026-03-06T00:25:00Z',
    estimatedDeliveryTime: '2026-03-06T00:45:00Z',
    events: [
      { id: 'ev-6', timestamp: '2026-03-06T00:05:00Z', event: 'Order Placed', actor: 'Lerato Nkosi' },
      { id: 'ev-7', timestamp: '2026-03-06T00:08:00Z', event: 'Order Confirmed', actor: 'Ocean Basket Rosebank' },
      { id: 'ev-8', timestamp: '2026-03-06T00:15:00Z', event: 'Driver Assigned', actor: 'System', notes: 'Tshepo Langa assigned' },
      { id: 'ev-9', timestamp: '2026-03-06T00:25:00Z', event: 'Picked Up', actor: 'Tshepo Langa' },
    ],
    supportTicketIds: [],
  },
  {
    id: 'ORD-1003', customerId: 'USR-003', customerName: 'Naledi Sithole', customerPhone: '+27 63 456 7890',
    restaurantId: 'REST-003', restaurantName: 'Steers Melville', driverId: undefined, driverName: undefined,
    status: 'preparing', items: [
      { id: 'item-6', name: 'King Steer Burger', quantity: 2, price: 79.90 },
      { id: 'item-7', name: 'Onion Rings', quantity: 1, price: 39.90 },
    ],
    subtotal: 199.70, deliveryFee: 20.00, serviceFee: 9.99, vat: 34.45, discount: 0, total: 264.14,
    pickupAddress: '7th St, Melville, 2092', dropoffAddress: '22 Beyers Naudé Dr, Northcliff, 2195',
    distance: 4.1,
    placedAt: '2026-03-06T00:12:00Z', confirmedAt: '2026-03-06T00:14:00Z',
    estimatedDeliveryTime: '2026-03-06T00:50:00Z',
    events: [
      { id: 'ev-10', timestamp: '2026-03-06T00:12:00Z', event: 'Order Placed', actor: 'Naledi Sithole' },
      { id: 'ev-11', timestamp: '2026-03-06T00:14:00Z', event: 'Order Confirmed', actor: 'Steers Melville' },
    ],
    supportTicketIds: [],
  },
  {
    id: 'ORD-1004', customerId: 'USR-004', customerName: 'Mandla Dlamini', customerPhone: '+27 74 567 8901',
    restaurantId: 'REST-004', restaurantName: 'Kota Joe\'s Soweto', driverId: 'DRV-003', driverName: 'Bongani Mthembu',
    status: 'cancelled', items: [
      { id: 'item-8', name: 'Classic Kota', quantity: 3, price: 45.00 },
      { id: 'item-9', name: '2L Coke', quantity: 1, price: 25.00 },
    ],
    subtotal: 160.00, deliveryFee: 15.00, serviceFee: 8.00, vat: 27.45, discount: 0, total: 210.45,
    pickupAddress: '1024 Vilakazi St, Soweto, 1804', dropoffAddress: '78 Klipspruit Rd, Soweto, 1811',
    distance: 6.3, cancelledAt: '2026-03-05T17:20:00Z',
    placedAt: '2026-03-05T17:00:00Z', confirmedAt: '2026-03-05T17:05:00Z',
    events: [
      { id: 'ev-12', timestamp: '2026-03-05T17:00:00Z', event: 'Order Placed', actor: 'Mandla Dlamini' },
      { id: 'ev-13', timestamp: '2026-03-05T17:05:00Z', event: 'Order Confirmed', actor: "Kota Joe's Soweto" },
      { id: 'ev-14', timestamp: '2026-03-05T17:20:00Z', event: 'Order Cancelled', actor: 'Mandla Dlamini', notes: 'Customer requested cancellation - taking too long' },
    ],
    supportTicketIds: ['TKT-001'],
  },
  {
    id: 'ORD-1005', customerId: 'USR-005', customerName: 'Zanele Mahlangu', customerPhone: '+27 81 678 9012',
    restaurantId: 'REST-005', restaurantName: 'Panarottis Fourways', driverId: 'DRV-004', driverName: 'Lucky Ngcobo',
    status: 'delivered', items: [
      { id: 'item-10', name: 'Margherita Pizza Large', quantity: 1, price: 109.90 },
      { id: 'item-11', name: 'Pasta Bolognese', quantity: 1, price: 89.90 },
    ],
    subtotal: 199.80, deliveryFee: 25.00, serviceFee: 9.99, vat: 35.22, discount: 20.00, total: 250.01,
    pickupAddress: 'Fourways Mall, Sandton, 2191', dropoffAddress: '10 Cedar Rd, Fourways, 2191',
    distance: 2.5, otp: '3345', proofOfDelivery: 'photo_url',
    placedAt: '2026-03-05T19:00:00Z', confirmedAt: '2026-03-05T19:03:00Z',
    pickedUpAt: '2026-03-05T19:25:00Z', deliveredAt: '2026-03-05T19:40:00Z',
    estimatedDeliveryTime: '2026-03-05T19:35:00Z',
    events: [
      { id: 'ev-15', timestamp: '2026-03-05T19:00:00Z', event: 'Order Placed', actor: 'Zanele Mahlangu' },
      { id: 'ev-16', timestamp: '2026-03-05T19:03:00Z', event: 'Order Confirmed', actor: 'Panarottis Fourways' },
      { id: 'ev-17', timestamp: '2026-03-05T19:15:00Z', event: 'Driver Assigned', actor: 'System', notes: 'Lucky Ngcobo assigned' },
      { id: 'ev-18', timestamp: '2026-03-05T19:25:00Z', event: 'Picked Up', actor: 'Lucky Ngcobo' },
      { id: 'ev-19', timestamp: '2026-03-05T19:40:00Z', event: 'Delivered', actor: 'Lucky Ngcobo' },
    ],
    supportTicketIds: [],
  },
  {
    id: 'ORD-1006', customerId: 'USR-006', customerName: 'Pulane Modise', customerPhone: '+27 72 789 0123',
    restaurantId: 'REST-006', restaurantName: 'Spur Cresta', driverId: 'DRV-005', driverName: 'Thabiso Zulu',
    status: 'picked_up', items: [
      { id: 'item-12', name: 'Rib & Chicken Combo', quantity: 1, price: 189.90 },
      { id: 'item-13', name: 'Milkshake', quantity: 2, price: 49.90 },
    ],
    subtotal: 289.70, deliveryFee: 30.00, serviceFee: 14.49, vat: 50.13, discount: 0, total: 384.32,
    pickupAddress: 'Cresta Mall, Randburg, 2194', dropoffAddress: '55 Republic Rd, Randburg, 2194',
    distance: 3.8, otp: '9912',
    placedAt: '2026-03-05T23:30:00Z', confirmedAt: '2026-03-05T23:33:00Z', pickedUpAt: '2026-03-05T23:55:00Z',
    estimatedDeliveryTime: '2026-03-06T00:15:00Z',
    events: [
      { id: 'ev-20', timestamp: '2026-03-05T23:30:00Z', event: 'Order Placed', actor: 'Pulane Modise' },
      { id: 'ev-21', timestamp: '2026-03-05T23:33:00Z', event: 'Order Confirmed', actor: 'Spur Cresta' },
      { id: 'ev-22', timestamp: '2026-03-05T23:45:00Z', event: 'Driver Assigned', actor: 'System', notes: 'Thabiso Zulu assigned' },
      { id: 'ev-23', timestamp: '2026-03-05T23:55:00Z', event: 'Picked Up', actor: 'Thabiso Zulu' },
    ],
    supportTicketIds: [],
  },
  {
    id: 'ORD-1007', customerId: 'USR-007', customerName: 'Kagiso Phiri', customerPhone: '+27 83 890 1234',
    restaurantId: 'REST-001', restaurantName: "Nando's Sandton", driverId: undefined, driverName: undefined,
    status: 'pending', items: [
      { id: 'item-14', name: 'Half Chicken', quantity: 1, price: 99.90 },
      { id: 'item-15', name: 'Peri-Peri Chips', quantity: 1, price: 39.90 },
    ],
    subtotal: 139.80, deliveryFee: 25.00, serviceFee: 6.99, vat: 25.77, discount: 0, total: 197.56,
    pickupAddress: '32 Maude St, Sandton, 2196', dropoffAddress: '200 Bryanston Dr, Bryanston, 2191',
    distance: 7.2,
    placedAt: '2026-03-06T00:18:00Z',
    estimatedDeliveryTime: '2026-03-06T01:00:00Z',
    events: [
      { id: 'ev-24', timestamp: '2026-03-06T00:18:00Z', event: 'Order Placed', actor: 'Kagiso Phiri' },
    ],
    supportTicketIds: [],
  },
  {
    id: 'ORD-1008', customerId: 'USR-008', customerName: 'Dineo Maseko', customerPhone: '+27 61 901 2345',
    restaurantId: 'REST-007', restaurantName: 'Mochachos Midrand', driverId: 'DRV-006', driverName: 'Vusi Nkosi',
    status: 'delivered', items: [
      { id: 'item-16', name: 'Flame Grilled Chicken', quantity: 1, price: 129.90 },
      { id: 'item-17', name: 'Pap & Chakalaka', quantity: 1, price: 35.00 },
    ],
    subtotal: 164.90, deliveryFee: 20.00, serviceFee: 8.25, vat: 28.97, discount: 0, total: 222.12,
    pickupAddress: 'Mall of Africa, Midrand, 1682', dropoffAddress: '12 Gallagher Ave, Midrand, 1685',
    distance: 3.0, otp: '6677', proofOfDelivery: 'photo_url',
    placedAt: '2026-03-05T20:00:00Z', confirmedAt: '2026-03-05T20:02:00Z',
    pickedUpAt: '2026-03-05T20:20:00Z', deliveredAt: '2026-03-05T20:38:00Z',
    estimatedDeliveryTime: '2026-03-05T20:35:00Z',
    events: [
      { id: 'ev-25', timestamp: '2026-03-05T20:00:00Z', event: 'Order Placed', actor: 'Dineo Maseko' },
      { id: 'ev-26', timestamp: '2026-03-05T20:02:00Z', event: 'Order Confirmed', actor: 'Mochachos Midrand' },
      { id: 'ev-27', timestamp: '2026-03-05T20:12:00Z', event: 'Driver Assigned', actor: 'System' },
      { id: 'ev-28', timestamp: '2026-03-05T20:20:00Z', event: 'Picked Up', actor: 'Vusi Nkosi' },
      { id: 'ev-29', timestamp: '2026-03-05T20:38:00Z', event: 'Delivered', actor: 'Vusi Nkosi' },
    ],
    supportTicketIds: [],
  },
  {
    id: 'ORD-1009', customerId: 'USR-009', customerName: 'Mpho Tau', customerPhone: '+27 73 012 3456',
    restaurantId: 'REST-008', restaurantName: 'Kung Fu Kitchen Braam', driverId: 'DRV-007', driverName: 'Sibusiso Radebe',
    status: 'refunded', items: [
      { id: 'item-18', name: 'Dim Sum Platter', quantity: 1, price: 159.00 },
      { id: 'item-19', name: 'Beef Noodle Soup', quantity: 1, price: 99.00 },
    ],
    subtotal: 258.00, deliveryFee: 25.00, serviceFee: 12.90, vat: 44.39, discount: 0, total: 340.29,
    pickupAddress: '70 De Beer St, Braamfontein, 2001', dropoffAddress: '15 Smit St, Braamfontein, 2001',
    distance: 1.2, otp: '1199', cancelledAt: '2026-03-05T21:45:00Z',
    placedAt: '2026-03-05T21:00:00Z', confirmedAt: '2026-03-05T21:03:00Z',
    pickedUpAt: '2026-03-05T21:30:00Z',
    events: [
      { id: 'ev-30', timestamp: '2026-03-05T21:00:00Z', event: 'Order Placed', actor: 'Mpho Tau' },
      { id: 'ev-31', timestamp: '2026-03-05T21:03:00Z', event: 'Order Confirmed', actor: 'Kung Fu Kitchen Braam' },
      { id: 'ev-32', timestamp: '2026-03-05T21:20:00Z', event: 'Driver Assigned', actor: 'System' },
      { id: 'ev-33', timestamp: '2026-03-05T21:30:00Z', event: 'Picked Up', actor: 'Sibusiso Radebe' },
      { id: 'ev-34', timestamp: '2026-03-05T21:45:00Z', event: 'Order Issue', actor: 'Mpho Tau', notes: 'Wrong items delivered' },
      { id: 'ev-35', timestamp: '2026-03-05T22:00:00Z', event: 'Full Refund Issued', actor: 'Admin - Kabelo', notes: 'R340.29 refunded' },
    ],
    supportTicketIds: ['TKT-002'],
  },
  {
    id: 'ORD-1010', customerId: 'USR-010', customerName: 'Nomsa Buthelezi', customerPhone: '+27 84 123 4567',
    restaurantId: 'REST-002', restaurantName: 'Ocean Basket Rosebank',
    status: 'confirmed', items: [
      { id: 'item-20', name: 'Fish & Chips', quantity: 2, price: 119.90 },
    ],
    subtotal: 239.80, deliveryFee: 25.00, serviceFee: 11.99, vat: 41.52, discount: 0, total: 318.31,
    pickupAddress: '121 Oxford Rd, Rosebank, 2196', dropoffAddress: '88 Empire Rd, Parktown, 2193',
    distance: 4.5,
    placedAt: '2026-03-06T00:15:00Z', confirmedAt: '2026-03-06T00:17:00Z',
    estimatedDeliveryTime: '2026-03-06T00:55:00Z',
    events: [
      { id: 'ev-36', timestamp: '2026-03-06T00:15:00Z', event: 'Order Placed', actor: 'Nomsa Buthelezi' },
      { id: 'ev-37', timestamp: '2026-03-06T00:17:00Z', event: 'Order Confirmed', actor: 'Ocean Basket Rosebank' },
    ],
    supportTicketIds: [],
  },
  // Additional orders for volume
  ...Array.from({ length: 16 }, (_, i) => {
    const statuses: Order['status'][] = ['delivered', 'delivered', 'delivered', 'cancelled', 'delivered', 'in_transit', 'preparing', 'delivered', 'delivered', 'confirmed', 'pending', 'delivered', 'delivered', 'picked_up', 'delivered', 'ready_for_pickup'];
    const restaurants = ['Nando\'s Sandton', 'Ocean Basket Rosebank', 'Steers Melville', 'Kota Joe\'s Soweto', 'Panarottis Fourways', 'Spur Cresta', 'Mochachos Midrand', 'Kung Fu Kitchen Braam'];
    const customers = ['Lesego Moyo', 'Thandeka Naidoo', 'Siyabonga Dube', 'Palesa Mogale', 'Kabelo Motaung', 'Nthabiseng Kgomo', 'Ofentse Malope', 'Refilwe Mabena', 'Katlego Seabi', 'Boitumelo Ramahlape', 'Tumi Legodi', 'Keabetswe Pitse', 'Amogelang Seleke', 'Lethabo Masina', 'Neo Makhanya', 'Karabo Mofokeng'];
    const idx = i + 11;
    return {
      id: `ORD-10${idx.toString().padStart(2, '0')}`,
      customerId: `USR-0${idx}`,
      customerName: customers[i],
      customerPhone: `+27 7${i} ${100 + i} ${1000 + i}`,
      restaurantId: `REST-00${(i % 8) + 1}`,
      restaurantName: restaurants[i % 8],
      driverId: statuses[i] !== 'pending' && statuses[i] !== 'confirmed' && statuses[i] !== 'preparing' ? `DRV-00${(i % 10) + 1}` : undefined,
      driverName: statuses[i] !== 'pending' && statuses[i] !== 'confirmed' && statuses[i] !== 'preparing' ? `Driver ${(i % 10) + 1}` : undefined,
      status: statuses[i],
      items: [{ id: `item-gen-${i}`, name: 'Combo Meal', quantity: 1 + (i % 3), price: 79.90 + (i * 10) }],
      subtotal: 79.90 + (i * 10) * (1 + (i % 3)),
      deliveryFee: 20 + (i % 3) * 5,
      serviceFee: 8.50,
      vat: 15.00 + i,
      discount: i % 4 === 0 ? 15 : 0,
      total: 120 + (i * 12),
      pickupAddress: `${i + 10} Main Rd, Johannesburg`,
      dropoffAddress: `${i + 20} Side St, Johannesburg`,
      distance: 2 + (i * 0.5),
      placedAt: `2026-03-0${5 - Math.floor(i / 8)}T${(10 + i) % 24}:${(i * 7) % 60}:00Z`,
      estimatedDeliveryTime: `2026-03-0${5 - Math.floor(i / 8)}T${(11 + i) % 24}:${(i * 7) % 60}:00Z`,
      events: [
        { id: `ev-gen-${i}`, timestamp: `2026-03-0${5 - Math.floor(i / 8)}T${(10 + i) % 24}:${(i * 7) % 60}:00Z`, event: 'Order Placed', actor: customers[i] },
      ],
      supportTicketIds: [] as string[],
    } as Order;
  }),
];

// ===== Users =====
export const mockCustomers: Customer[] = [
  { id: 'USR-001', name: 'Thabo Molefe', email: 'thabo@email.com', phone: '+27 71 234 5678', role: 'customer', status: 'active', createdAt: '2025-06-15T10:00:00Z', totalOrders: 47, totalSpent: 12450.50 },
  { id: 'USR-002', name: 'Lerato Nkosi', email: 'lerato@email.com', phone: '+27 82 345 6789', role: 'customer', status: 'active', createdAt: '2025-07-20T14:00:00Z', totalOrders: 32, totalSpent: 8920.00 },
  { id: 'USR-003', name: 'Naledi Sithole', email: 'naledi@email.com', phone: '+27 63 456 7890', role: 'customer', status: 'active', createdAt: '2025-08-10T09:00:00Z', totalOrders: 28, totalSpent: 6780.00 },
  { id: 'USR-004', name: 'Mandla Dlamini', email: 'mandla@email.com', phone: '+27 74 567 8901', role: 'customer', status: 'active', createdAt: '2025-09-01T16:00:00Z', totalOrders: 15, totalSpent: 3200.00 },
  { id: 'USR-005', name: 'Zanele Mahlangu', email: 'zanele@email.com', phone: '+27 81 678 9012', role: 'customer', status: 'active', createdAt: '2025-10-05T11:00:00Z', totalOrders: 52, totalSpent: 15600.00 },
  { id: 'USR-006', name: 'Pulane Modise', email: 'pulane@email.com', phone: '+27 72 789 0123', role: 'customer', status: 'inactive', createdAt: '2025-11-12T08:00:00Z', totalOrders: 3, totalSpent: 450.00 },
  { id: 'USR-007', name: 'Kagiso Phiri', email: 'kagiso@email.com', phone: '+27 83 890 1234', role: 'customer', status: 'active', createdAt: '2025-12-01T13:00:00Z', totalOrders: 21, totalSpent: 5890.00 },
  { id: 'USR-008', name: 'Dineo Maseko', email: 'dineo@email.com', phone: '+27 61 901 2345', role: 'customer', status: 'suspended', createdAt: '2026-01-15T15:00:00Z', totalOrders: 8, totalSpent: 1920.00 },
];

export const mockDrivers: Driver[] = [
  { id: 'DRV-001', name: 'Sipho Khumalo', email: 'sipho@driver.com', phone: '+27 71 111 2222', role: 'driver', status: 'active', createdAt: '2025-05-01T10:00:00Z', vehicleType: 'Motorcycle', vehiclePlate: 'GP 123-456', driverStatus: 'online', rating: 4.8, totalDeliveries: 1240, isVerified: true, earnings: 45200.00 },
  { id: 'DRV-002', name: 'Tshepo Langa', email: 'tshepo@driver.com', phone: '+27 82 222 3333', role: 'driver', status: 'active', createdAt: '2025-05-15T10:00:00Z', vehicleType: 'Motorcycle', vehiclePlate: 'GP 234-567', driverStatus: 'on_delivery', rating: 4.6, totalDeliveries: 980, isVerified: true, earnings: 38500.00 },
  { id: 'DRV-003', name: 'Bongani Mthembu', email: 'bongani@driver.com', phone: '+27 63 333 4444', role: 'driver', status: 'active', createdAt: '2025-06-01T10:00:00Z', vehicleType: 'Car', vehiclePlate: 'GP 345-678', driverStatus: 'online', rating: 4.9, totalDeliveries: 1560, isVerified: true, earnings: 52100.00 },
  { id: 'DRV-004', name: 'Lucky Ngcobo', email: 'lucky@driver.com', phone: '+27 74 444 5555', role: 'driver', status: 'active', createdAt: '2025-06-20T10:00:00Z', vehicleType: 'Motorcycle', vehiclePlate: 'GP 456-789', driverStatus: 'offline', rating: 4.5, totalDeliveries: 720, isVerified: true, earnings: 28900.00 },
  { id: 'DRV-005', name: 'Thabiso Zulu', email: 'thabiso@driver.com', phone: '+27 81 555 6666', role: 'driver', status: 'active', createdAt: '2025-07-10T10:00:00Z', vehicleType: 'Car', vehiclePlate: 'GP 567-890', driverStatus: 'on_delivery', rating: 4.7, totalDeliveries: 890, isVerified: true, earnings: 34600.00 },
  { id: 'DRV-006', name: 'Vusi Nkosi', email: 'vusi@driver.com', phone: '+27 72 666 7777', role: 'driver', status: 'active', createdAt: '2025-08-01T10:00:00Z', vehicleType: 'Bicycle', vehiclePlate: 'N/A', driverStatus: 'online', rating: 4.3, totalDeliveries: 340, isVerified: true, earnings: 12800.00 },
  { id: 'DRV-007', name: 'Sibusiso Radebe', email: 'sibusiso@driver.com', phone: '+27 83 777 8888', role: 'driver', status: 'active', createdAt: '2025-08-15T10:00:00Z', vehicleType: 'Motorcycle', vehiclePlate: 'GP 678-901', driverStatus: 'online', rating: 4.4, totalDeliveries: 560, isVerified: true, earnings: 21200.00 },
  { id: 'DRV-008', name: 'Themba Mokoena', email: 'themba@driver.com', phone: '+27 61 888 9999', role: 'driver', status: 'active', createdAt: '2025-09-01T10:00:00Z', vehicleType: 'Car', vehiclePlate: 'GP 789-012', driverStatus: 'offline', rating: 4.1, totalDeliveries: 210, isVerified: false, earnings: 8400.00 },
  { id: 'DRV-009', name: 'Nhlanhla Cele', email: 'nhlanhla@driver.com', phone: '+27 73 999 0000', role: 'driver', status: 'inactive', createdAt: '2025-09-20T10:00:00Z', vehicleType: 'Motorcycle', vehiclePlate: 'GP 890-123', driverStatus: 'offline', rating: 3.9, totalDeliveries: 150, isVerified: false, earnings: 5600.00 },
  { id: 'DRV-010', name: 'Jabulani Mkhize', email: 'jabulani@driver.com', phone: '+27 84 000 1111', role: 'driver', status: 'active', createdAt: '2025-10-05T10:00:00Z', vehicleType: 'Motorcycle', vehiclePlate: 'GP 901-234', driverStatus: 'online', rating: 4.6, totalDeliveries: 480, isVerified: true, earnings: 18900.00 },
  { id: 'DRV-011', name: 'Senzo Gumede', email: 'senzo@driver.com', phone: '+27 71 010 2020', role: 'driver', status: 'active', createdAt: '2025-10-20T10:00:00Z', vehicleType: 'Car', vehiclePlate: 'GP 012-345', driverStatus: 'online', rating: 4.7, totalDeliveries: 620, isVerified: true, earnings: 24500.00 },
];

export const mockRestaurantStaff: RestaurantStaff[] = [
  { id: 'STAFF-001', name: 'Maria Santos', email: 'maria@nandos.com', phone: '+27 11 234 5678', role: 'restaurant_staff', status: 'active', createdAt: '2025-05-01T10:00:00Z', restaurantId: 'REST-001' },
  { id: 'STAFF-002', name: 'James Fisher', email: 'james@oceanbasket.com', phone: '+27 11 345 6789', role: 'restaurant_staff', status: 'active', createdAt: '2025-06-01T10:00:00Z', restaurantId: 'REST-002' },
  { id: 'STAFF-003', name: 'Palesa Mokone', email: 'palesa@steers.com', phone: '+27 11 456 7890', role: 'restaurant_staff', status: 'active', createdAt: '2025-07-01T10:00:00Z', restaurantId: 'REST-003' },
];

export const mockAdmins: User[] = [
  { id: 'ADM-001', name: 'Kabelo Motha', email: 'kabelo@platform.com', phone: '+27 82 100 2000', role: 'admin', status: 'active', createdAt: '2025-01-01T10:00:00Z' },
  { id: 'ADM-002', name: 'Ayanda Ndlovu', email: 'ayanda@platform.com', phone: '+27 83 200 3000', role: 'admin', status: 'active', createdAt: '2025-01-15T10:00:00Z' },
];

// ===== Restaurants =====
export const mockRestaurants: Restaurant[] = [
  { id: 'REST-001', name: "Nando's Sandton", ownerName: 'Maria Santos', email: 'sandton@nandos.co.za', phone: '+27 11 234 5678', cuisine: 'Portuguese/Chicken', rating: 4.5, ordersCount: 3420, commissionRate: 15, status: 'active', isOpen: true, address: '32 Maude St, Sandton, 2196', createdAt: '2025-03-01T10:00:00Z' },
  { id: 'REST-002', name: 'Ocean Basket Rosebank', ownerName: 'James Fisher', email: 'rosebank@oceanbasket.com', phone: '+27 11 345 6789', cuisine: 'Seafood', rating: 4.3, ordersCount: 2180, commissionRate: 12, status: 'active', isOpen: true, address: '121 Oxford Rd, Rosebank, 2196', createdAt: '2025-03-15T10:00:00Z' },
  { id: 'REST-003', name: 'Steers Melville', ownerName: 'Palesa Mokone', email: 'melville@steers.co.za', phone: '+27 11 456 7890', cuisine: 'Burgers/Fast Food', rating: 4.1, ordersCount: 1890, commissionRate: 18, status: 'active', isOpen: true, address: '7th St, Melville, 2092', createdAt: '2025-04-01T10:00:00Z' },
  { id: 'REST-004', name: "Kota Joe's Soweto", ownerName: 'Joseph Moyo', email: 'kotajoe@email.com', phone: '+27 11 567 8901', cuisine: 'Street Food/Kota', rating: 4.7, ordersCount: 4210, commissionRate: 10, status: 'active', isOpen: false, address: '1024 Vilakazi St, Soweto, 1804', createdAt: '2025-04-15T10:00:00Z' },
  { id: 'REST-005', name: 'Panarottis Fourways', ownerName: 'Tony Ricci', email: 'fourways@panarottis.co.za', phone: '+27 11 678 9012', cuisine: 'Italian/Pizza', rating: 4.0, ordersCount: 1560, commissionRate: 15, status: 'active', isOpen: true, address: 'Fourways Mall, Sandton, 2191', createdAt: '2025-05-01T10:00:00Z' },
  { id: 'REST-006', name: 'Spur Cresta', ownerName: 'Louise van der Merwe', email: 'cresta@spur.co.za', phone: '+27 11 789 0123', cuisine: 'Family/Grill', rating: 3.9, ordersCount: 1120, commissionRate: 15, status: 'active', isOpen: true, address: 'Cresta Mall, Randburg, 2194', createdAt: '2025-06-01T10:00:00Z' },
  { id: 'REST-007', name: 'Mochachos Midrand', ownerName: 'Ahmed Patel', email: 'midrand@mochachos.co.za', phone: '+27 11 890 1234', cuisine: 'Chicken/Portuguese', rating: 4.2, ordersCount: 980, commissionRate: 14, status: 'active', isOpen: true, address: 'Mall of Africa, Midrand, 1682', createdAt: '2025-07-01T10:00:00Z' },
  { id: 'REST-008', name: 'Kung Fu Kitchen Braam', ownerName: 'Wei Chen', email: 'braam@kungfukitchen.co.za', phone: '+27 11 901 2345', cuisine: 'Chinese/Asian Fusion', rating: 4.4, ordersCount: 760, commissionRate: 12, status: 'active', isOpen: false, address: '70 De Beer St, Braamfontein, 2001', createdAt: '2025-08-01T10:00:00Z' },
  { id: 'REST-009', name: 'The Indian Chapter', ownerName: 'Priya Naidoo', email: 'info@indianchapter.co.za', phone: '+27 11 012 3456', cuisine: 'Indian', rating: 4.6, ordersCount: 520, commissionRate: 13, status: 'inactive', isOpen: false, address: '45 Nelson Mandela Square, Sandton', createdAt: '2025-09-01T10:00:00Z' },
];

// ===== Promotions =====
export const mockPromotions: Promotion[] = [
  { id: 'PROMO-001', code: 'WELCOME50', type: 'percentage', value: 50, minOrder: 100, maxDiscount: 75, usageLimit: 1000, usageCount: 743, startDate: '2026-01-01', endDate: '2026-06-30', status: 'active', createdAt: '2025-12-15T10:00:00Z' },
  { id: 'PROMO-002', code: 'FREEDELIVERY', type: 'free_delivery', value: 0, minOrder: 150, usageLimit: 5000, usageCount: 2891, startDate: '2026-02-01', endDate: '2026-04-30', status: 'active', createdAt: '2026-01-25T10:00:00Z' },
  { id: 'PROMO-003', code: 'NANDOS20', type: 'fixed', value: 20, minOrder: 80, usageLimit: 500, usageCount: 312, startDate: '2026-02-15', endDate: '2026-03-31', status: 'active', restaurantId: 'REST-001', restaurantName: "Nando's Sandton", createdAt: '2026-02-10T10:00:00Z' },
  { id: 'PROMO-004', code: 'LUNCH15', type: 'percentage', value: 15, minOrder: 120, maxDiscount: 50, usageLimit: 2000, usageCount: 1456, startDate: '2026-01-15', endDate: '2026-03-15', status: 'active', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'PROMO-005', code: 'SUMMER30', type: 'percentage', value: 30, minOrder: 200, maxDiscount: 100, usageLimit: 800, usageCount: 800, startDate: '2025-11-01', endDate: '2026-02-28', status: 'expired', createdAt: '2025-10-20T10:00:00Z' },
  { id: 'PROMO-006', code: 'OCEANBASKET10', type: 'fixed', value: 10, minOrder: 100, usageLimit: 300, usageCount: 45, startDate: '2026-03-01', endDate: '2026-05-31', status: 'active', restaurantId: 'REST-002', restaurantName: 'Ocean Basket Rosebank', createdAt: '2026-02-25T10:00:00Z' },
];

// ===== Payouts =====
export const mockRestaurantPayouts: RestaurantPayout[] = [
  { id: 'RPAY-001', restaurantId: 'REST-001', restaurantName: "Nando's Sandton", period: '2026-02-24 — 2026-03-02', orderCount: 245, gross: 68500.00, commission: 10275.00, net: 58225.00, status: 'paid', processedAt: '2026-03-03T10:00:00Z' },
  { id: 'RPAY-002', restaurantId: 'REST-002', restaurantName: 'Ocean Basket Rosebank', period: '2026-02-24 — 2026-03-02', orderCount: 156, gross: 52300.00, commission: 6276.00, net: 46024.00, status: 'paid', processedAt: '2026-03-03T10:00:00Z' },
  { id: 'RPAY-003', restaurantId: 'REST-003', restaurantName: 'Steers Melville', period: '2026-02-24 — 2026-03-02', orderCount: 134, gross: 28900.00, commission: 5202.00, net: 23698.00, status: 'processing' },
  { id: 'RPAY-004', restaurantId: 'REST-004', restaurantName: "Kota Joe's Soweto", period: '2026-02-24 — 2026-03-02', orderCount: 312, gross: 42100.00, commission: 4210.00, net: 37890.00, status: 'pending' },
  { id: 'RPAY-005', restaurantId: 'REST-005', restaurantName: 'Panarottis Fourways', period: '2026-02-24 — 2026-03-02', orderCount: 98, gross: 22450.00, commission: 3367.50, net: 19082.50, status: 'pending' },
  { id: 'RPAY-006', restaurantId: 'REST-001', restaurantName: "Nando's Sandton", period: '2026-03-03 — 2026-03-09', orderCount: 198, gross: 55200.00, commission: 8280.00, net: 46920.00, status: 'pending' },
];

export const mockDriverPayouts: DriverPayout[] = [
  { id: 'DPAY-001', driverId: 'DRV-001', driverName: 'Sipho Khumalo', period: '2026-02-24 — 2026-03-02', deliveries: 89, earnings: 4450.00, tips: 890.00, incentives: 500.00, total: 5840.00, status: 'paid', processedAt: '2026-03-03T10:00:00Z' },
  { id: 'DPAY-002', driverId: 'DRV-002', driverName: 'Tshepo Langa', period: '2026-02-24 — 2026-03-02', deliveries: 72, earnings: 3600.00, tips: 720.00, incentives: 300.00, total: 4620.00, status: 'paid', processedAt: '2026-03-03T10:00:00Z' },
  { id: 'DPAY-003', driverId: 'DRV-003', driverName: 'Bongani Mthembu', period: '2026-02-24 — 2026-03-02', deliveries: 105, earnings: 5250.00, tips: 1050.00, incentives: 750.00, total: 7050.00, status: 'processing' },
  { id: 'DPAY-004', driverId: 'DRV-004', driverName: 'Lucky Ngcobo', period: '2026-02-24 — 2026-03-02', deliveries: 52, earnings: 2600.00, tips: 520.00, incentives: 200.00, total: 3320.00, status: 'pending' },
  { id: 'DPAY-005', driverId: 'DRV-005', driverName: 'Thabiso Zulu', period: '2026-02-24 — 2026-03-02', deliveries: 68, earnings: 3400.00, tips: 680.00, incentives: 400.00, total: 4480.00, status: 'pending' },
  { id: 'DPAY-006', driverId: 'DRV-006', driverName: 'Vusi Nkosi', period: '2026-02-24 — 2026-03-02', deliveries: 25, earnings: 1250.00, tips: 250.00, incentives: 0, total: 1500.00, status: 'failed' },
];

// ===== Support Tickets =====
export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'TKT-001', userId: 'USR-004', userName: 'Mandla Dlamini', orderId: 'ORD-1004',
    subject: 'Order took too long - requesting refund', category: 'delivery', priority: 'high', status: 'open',
    assignedTo: 'ADM-001', assignedToName: 'Kabelo Motha',
    createdAt: '2026-03-05T17:25:00Z', updatedAt: '2026-03-05T18:00:00Z',
    messages: [
      { id: 'msg-1', senderId: 'USR-004', senderName: 'Mandla Dlamini', senderRole: 'user', message: 'My order was supposed to arrive in 30 minutes but after 45 minutes the driver was still not at the restaurant. I cancelled but want a full refund.', timestamp: '2026-03-05T17:25:00Z' },
      { id: 'msg-2', senderId: 'ADM-001', senderName: 'Kabelo Motha', senderRole: 'admin', message: 'Hi Mandla, I\'m sorry about your experience. I can see the delay was on our side. Let me process a full refund for you right away.', timestamp: '2026-03-05T18:00:00Z' },
    ],
  },
  {
    id: 'TKT-002', userId: 'USR-009', userName: 'Mpho Tau', orderId: 'ORD-1009',
    subject: 'Received wrong items', category: 'order_issue', priority: 'urgent', status: 'resolved',
    assignedTo: 'ADM-001', assignedToName: 'Kabelo Motha',
    createdAt: '2026-03-05T21:50:00Z', updatedAt: '2026-03-05T22:15:00Z',
    messages: [
      { id: 'msg-3', senderId: 'USR-009', senderName: 'Mpho Tau', senderRole: 'user', message: 'I ordered Dim Sum Platter and Beef Noodle Soup but received completely different dishes. This is unacceptable.', timestamp: '2026-03-05T21:50:00Z' },
      { id: 'msg-4', senderId: 'ADM-001', senderName: 'Kabelo Motha', senderRole: 'admin', message: 'I sincerely apologize for this mix-up. I\'ve issued a full refund of R340.29 to your account. It should reflect within 24 hours.', timestamp: '2026-03-05T22:15:00Z' },
    ],
  },
  {
    id: 'TKT-003', userId: 'USR-005', userName: 'Zanele Mahlangu',
    subject: 'Cannot update payment method', category: 'payment', priority: 'medium', status: 'in_progress',
    assignedTo: 'ADM-002', assignedToName: 'Ayanda Ndlovu',
    createdAt: '2026-03-05T14:00:00Z', updatedAt: '2026-03-05T15:30:00Z',
    messages: [
      { id: 'msg-5', senderId: 'USR-005', senderName: 'Zanele Mahlangu', senderRole: 'user', message: 'I\'m trying to add a new Visa card but the app keeps showing an error. I\'ve tried 3 times.', timestamp: '2026-03-05T14:00:00Z' },
      { id: 'msg-6', senderId: 'ADM-002', senderName: 'Ayanda Ndlovu', senderRole: 'admin', message: 'Hi Zanele, we\'re aware of an intermittent issue with our payment provider. Our team is working on it. I\'ll update you once it\'s resolved.', timestamp: '2026-03-05T15:30:00Z' },
    ],
  },
  {
    id: 'TKT-004', userId: 'USR-001', userName: 'Thabo Molefe',
    subject: 'Account login issues', category: 'account', priority: 'low', status: 'closed',
    assignedTo: 'ADM-002', assignedToName: 'Ayanda Ndlovu',
    createdAt: '2026-03-04T10:00:00Z', updatedAt: '2026-03-04T11:00:00Z',
    messages: [
      { id: 'msg-7', senderId: 'USR-001', senderName: 'Thabo Molefe', senderRole: 'user', message: 'I can\'t log in on my new phone. Keep getting "invalid credentials" error.', timestamp: '2026-03-04T10:00:00Z' },
      { id: 'msg-8', senderId: 'ADM-002', senderName: 'Ayanda Ndlovu', senderRole: 'admin', message: 'Hi Thabo, I\'ve sent a password reset link to your email. Please try logging in after resetting your password.', timestamp: '2026-03-04T10:30:00Z' },
      { id: 'msg-9', senderId: 'USR-001', senderName: 'Thabo Molefe', senderRole: 'user', message: 'That worked, thanks!', timestamp: '2026-03-04T11:00:00Z' },
    ],
  },
  {
    id: 'TKT-005', userId: 'USR-010', userName: 'Nomsa Buthelezi', orderId: 'ORD-1010',
    subject: 'Driver was rude during delivery', category: 'delivery', priority: 'high', status: 'open',
    createdAt: '2026-03-06T00:20:00Z', updatedAt: '2026-03-06T00:20:00Z',
    messages: [
      { id: 'msg-10', senderId: 'USR-010', senderName: 'Nomsa Buthelezi', senderRole: 'user', message: 'The driver was very rude and impatient when I went to collect my food at the gate. This was very unprofessional.', timestamp: '2026-03-06T00:20:00Z' },
    ],
  },
  {
    id: 'TKT-006', userId: 'STAFF-001', userName: 'Maria Santos',
    subject: 'Commission rate needs adjustment', category: 'restaurant', priority: 'medium', status: 'open',
    createdAt: '2026-03-05T09:00:00Z', updatedAt: '2026-03-05T09:00:00Z',
    messages: [
      { id: 'msg-11', senderId: 'STAFF-001', senderName: 'Maria Santos', senderRole: 'user', message: 'We discussed reducing our commission rate from 15% to 12% based on our volume. Can this be updated?', timestamp: '2026-03-05T09:00:00Z' },
    ],
  },
];

// Combined users helper
export const mockAllUsers: User[] = [
  ...mockCustomers,
  ...mockDrivers,
  ...mockRestaurantStaff,
  ...mockAdmins,
];
