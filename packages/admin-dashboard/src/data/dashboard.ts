import { CheckCircle, Truck, Clock } from 'lucide-react'
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react'

export const dashboardStats = [
  { label: 'Total Revenue', value: '₹4,52,350', change: 12.5, up: true,  icon: DollarSign,  color: '#059669', bg: '#ecfdf5' },
  { label: 'Total Orders',  value: '1,234',     change: 8.2,  up: true,  icon: ShoppingCart, color: '#2563eb', bg: '#eff6ff' },
  { label: 'Products',      value: '456',        change: 2.1,  up: true,  icon: Package,      color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Customers',     value: '892',        change: 5.4,  up: true,  icon: Users,        color: '#d97706', bg: '#fffbeb' },
]

export const recentOrders = [
  { id: '#ORD-001', customer: 'Rajesh Kumar', product: 'Red Roses Bunch',  amount: '₹756',   status: 'Delivered',   time: '2h ago' },
  { id: '#ORD-002', customer: 'Priya Sharma', product: 'Mixed Pooja Kit',  amount: '₹599',   status: 'In Delivery', time: '4h ago' },
  { id: '#ORD-003', customer: 'Amit Patel',   product: 'Jasmine Garland',  amount: '₹1,299', status: 'Confirmed',   time: '5h ago' },
  { id: '#ORD-004', customer: 'Sunita Rao',   product: 'Birthday Bouquet', amount: '₹849',   status: 'Pending',     time: '6h ago' },
]

export const dashboardStatusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  Delivered:     { icon: CheckCircle, color: '#059669', bg: '#ecfdf5' },
  'In Delivery': { icon: Truck,       color: '#2563eb', bg: '#eff6ff' },
  Confirmed:     { icon: Clock,       color: '#7c3aed', bg: '#f5f3ff' },
  Pending:       { icon: Clock,       color: '#d97706', bg: '#fffbeb' },
}

export const barHeights = [40, 65, 45, 80, 60, 90, 72, 55, 85, 70, 95, 78]
