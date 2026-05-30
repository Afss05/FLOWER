import { useState } from 'react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { motion } from 'framer-motion'
import { Package, Download } from 'lucide-react'
import { Card, Badge, Button } from '@/components/common'
import { Link } from 'react-router-dom'
import { customerOrderStatuses, customerOrders } from '@/data'

export default function OrdersPage() {
  usePageTitle('My Orders')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredOrders = selectedStatus
    ? customerOrders.filter(order => order.status === selectedStatus)
    : customerOrders

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-2">My Orders</h1>
          <p className="text-secondary-600">Track and manage all your flower orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {customerOrderStatuses.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setSelectedStatus(selectedStatus === item.status ? null : item.status)
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-xl border-2 transition ${
                  selectedStatus === item.status
                    ? 'border-primary-950 bg-primary-950 text-white'
                    : 'border-secondary-200 bg-white hover:border-primary-950'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs font-semibold">{item.label}</p>
              </motion.button>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, idx) => {
              const statusInfo = customerOrderStatuses.find(s => s.status === order.status)
              const StatusIcon = statusInfo?.icon || Package

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card interactive className="p-6">
                    <div className="grid md:grid-cols-5 gap-6 items-start">
                      <div className="md:col-span-1">
                        <img
                          src={order.image}
                          alt={order.items}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <h3 className="font-bold text-lg text-secondary-900">{order.id}</h3>
                        <p className="text-secondary-600">{order.items}</p>
                        <p className="text-sm text-secondary-500">Ordered on {order.date}</p>
                        <div className="flex gap-2 pt-2">
                          <Badge variant="primary">{order.status === 'delivered' ? 'Completed' : 'In Progress'}</Badge>
                          <Badge variant="accent">₹{order.total}</Badge>
                        </div>
                      </div>

                      <div className="md:col-span-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-5 h-5 text-primary-950" />
                          <div>
                            <p className="text-xs text-secondary-500">Status</p>
                            <p className="font-semibold text-secondary-900 capitalize">
                              {order.status.replace('-', ' ')}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-secondary-500">Tracking</p>
                          <p className="font-mono text-sm text-secondary-900">{order.trackingId}</p>
                        </div>
                      </div>

                      <div className="md:col-span-1 flex gap-2 flex-col">
                        <Button variant="secondary" size="sm" className="w-full">
                          <Download className="w-4 h-4 mr-1" />
                          Invoice
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full">
                          Reorder
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-secondary-200 flex items-center justify-between">
                      <p className="text-sm text-secondary-600">{order.deliveryDate}</p>
                      <Button variant="accent" size="sm">
                        Track Order
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <Card className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
              <h3 className="text-xl font-bold text-secondary-900 mb-2">No Orders Yet</h3>
              <p className="text-secondary-600">Start shopping to place your first order</p>
              <Link to="/products">
                <Button variant="primary" className="mt-6">
                  Start Shopping
                </Button>
              </Link>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
