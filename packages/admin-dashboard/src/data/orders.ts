import { CheckCircle, Truck, Clock, XCircle } from 'lucide-react'

export const allOrders = [
  { id: '#ORD-001', customer: 'Rajesh Kumar', product: 'Red Roses Bunch',    amount: '₹756',   status: 'Delivered',   date: '30 May 2026', city: 'Chennai' },
  { id: '#ORD-002', customer: 'Priya Sharma', product: 'Mixed Pooja Kit',    amount: '₹599',   status: 'In Delivery', date: '29 May 2026', city: 'Bangalore' },
  { id: '#ORD-003', customer: 'Amit Patel',   product: 'Jasmine Garland',    amount: '₹1,299', status: 'Confirmed',   date: '28 May 2026', city: 'Mumbai' },
  { id: '#ORD-004', customer: 'Sunita Rao',   product: 'Birthday Bouquet',   amount: '₹849',   status: 'Pending',     date: '28 May 2026', city: 'Hyderabad' },
  { id: '#ORD-005', customer: 'Vikram Singh', product: 'Rose Gift Box',      amount: '₹1,599', status: 'Delivered',   date: '27 May 2026', city: 'Delhi' },
  { id: '#ORD-006', customer: 'Meena Iyer',   product: 'Lotus Arrangement',  amount: '₹699',   status: 'Cancelled',   date: '27 May 2026', city: 'Kochi' },
]

export const orderStatusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
  Delivered:     { icon: CheckCircle, color: '#059669', bg: '#ecfdf5', label: 'Delivered' },
  'In Delivery': { icon: Truck,       color: '#2563eb', bg: '#eff6ff', label: 'In Delivery' },
  Confirmed:     { icon: Clock,       color: '#7c3aed', bg: '#f5f3ff', label: 'Confirmed' },
  Pending:       { icon: Clock,       color: '#d97706', bg: '#fffbeb', label: 'Pending' },
  Cancelled:     { icon: XCircle,     color: '#dc2626', bg: '#fef2f2', label: 'Cancelled' },
}

export const orderFilters = ['All', 'Pending', 'Confirmed', 'In Delivery', 'Delivered', 'Cancelled']
