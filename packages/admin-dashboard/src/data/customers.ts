export const customers = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com',  phone: '+91 98765 43210', city: 'Chennai',   orders: 12, spent: '₹8,450',  joined: 'Jan 2025', status: 'VIP' },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com',   phone: '+91 97654 32109', city: 'Bangalore', orders: 8,  spent: '₹5,200',  joined: 'Mar 2025', status: 'Active' },
  { id: 3, name: 'Amit Patel',   email: 'amit@example.com',    phone: '+91 96543 21098', city: 'Mumbai',    orders: 5,  spent: '₹3,100',  joined: 'Jun 2025', status: 'Active' },
  { id: 4, name: 'Sunita Rao',   email: 'sunita@example.com',  phone: '+91 95432 10987', city: 'Hyderabad', orders: 15, spent: '₹12,600', joined: 'Nov 2024', status: 'VIP' },
  { id: 5, name: 'Vikram Singh', email: 'vikram@example.com',  phone: '+91 94321 09876', city: 'Delhi',     orders: 3,  spent: '₹1,800',  joined: 'Dec 2025', status: 'New' },
]

export const customerStatusColors: Record<string, { color: string; bg: string }> = {
  VIP:    { color: '#7c3aed', bg: '#f5f3ff' },
  Active: { color: '#059669', bg: '#ecfdf5' },
  New:    { color: '#2563eb', bg: '#eff6ff' },
}
