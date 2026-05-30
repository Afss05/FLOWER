import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react'
import { products, productCategories } from '@/data'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')

  const filtered = products.filter(p =>
    (cat === 'All' || p.category === cat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Products</h2>
          <p className="text-slate-500 text-sm mt-0.5">{products.length} total products</p>
        </div>
        <button className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-700 transition shadow-sm shadow-rose-200">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: '456', color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'In Stock', value: '412', color: '#059669', bg: '#ecfdf5' },
          { label: 'Low Stock', value: '18', color: '#d97706', bg: '#fffbeb' },
          { label: 'Out of Stock', value: '26', color: '#dc2626', bg: '#fef2f2' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
          >
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-slate-500 text-sm mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 flex-1 min-w-40">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {productCategories.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                cat === c ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sold</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                        {p.img}
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">{p.category}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{p.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {p.stock <= 10 && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                      <span
                        className={`text-sm font-semibold ${
                          p.stock <= 10 ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {p.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{p.sold}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                      ★ {p.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 transition text-slate-500 hover:text-blue-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 transition text-slate-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
