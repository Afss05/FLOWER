import { Clock, CheckCircle, Truck } from 'lucide-react'

export const customerOrderStatuses = [
  { status: 'pending',     icon: Clock,         label: 'Pending' },
  { status: 'confirmed',   icon: CheckCircle,   label: 'Confirmed' },
  { status: 'in-delivery', icon: Truck,         label: 'In Delivery' },
  { status: 'delivered',   icon: CheckCircle,   label: 'Delivered' },
]

export const customerOrders = [
  {
    id: '#ORD-2024-001',
    date: '30 May 2024',
    items: 'Red Roses Bunch × 2',
    total: 756,
    status: 'delivered',
    deliveryDate: '30 May 2024',
    trackingId: 'TRK123456789',
    image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=100&h=100&fit=crop',
  },
  {
    id: '#ORD-2024-002',
    date: '28 May 2024',
    items: 'Mixed Pooja Flowers',
    total: 599,
    status: 'in-delivery',
    deliveryDate: 'Expected: Today',
    trackingId: 'TRK987654321',
    image: 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=100&h=100&fit=crop',
  },
]
