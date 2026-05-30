import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, ChevronDown, ChevronUp, Instagram, Facebook, Twitter } from 'lucide-react'
import { Button, Input } from '@/components/common'
import { usePageTitle } from '@/hooks/usePageTitle'
import { contactFaqs } from '@/data'

export default function ContactPage() {
  usePageTitle('Contact Us')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero */}
      <section className="pt-20 pb-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h1 className="text-5xl font-bold text-secondary-900 mb-4">Get in Touch</h1>
          <p className="text-secondary-600 text-lg max-w-lg mx-auto">
            Have a question, a custom order, or just want to say hello? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      {/* Info Cards */}
      <section className="px-4 max-w-5xl mx-auto mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Phone, title: 'Phone', info: '+91 98765 43210', sub: 'Mon–Sun, 8 AM – 9 PM', color: 'bg-blue-50 text-blue-600' },
            { icon: Mail, title: 'Email', info: 'hello@flowershop.in', sub: 'Reply within 4 hours', color: 'bg-rose-50 text-rose-600' },
            { icon: MapPin, title: 'Address', info: '123 Flower Street', sub: 'Anna Nagar, Chennai', color: 'bg-emerald-50 text-emerald-600' },
            { icon: Clock, title: 'Hours', info: '8 AM – 9 PM', sub: 'Open all 7 days', color: 'bg-amber-50 text-amber-600' },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-bold text-slate-900 text-sm mb-1">{item.title}</p>
                <p className="text-slate-800 text-sm font-medium">{item.info}</p>
                <p className="text-slate-500 text-xs mt-0.5">{item.sub}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Form + Map */}
      <section className="px-4 max-w-5xl mx-auto mb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
            <p className="text-slate-500 text-sm mb-6">We usually reply within a few hours.</p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">🌸</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm mb-6">Thank you for reaching out. We'll get back to you within a few hours.</p>
                  <button onClick={() => setSubmitted(false)} className="text-rose-600 text-sm font-semibold underline">Send another message</button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Priya Sharma"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                      <input
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                    <select
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition"
                    >
                      <option value="">Select a topic…</option>
                      <option>Order enquiry</option>
                      <option>Custom arrangement</option>
                      <option>Subscription help</option>
                      <option>Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us how we can help…"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition resize-none"
                    />
                  </div>
                  <Button type="submit" variant="accent" className="w-full" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Map + Social */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {/* Map placeholder */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex-1 min-h-64">
              <div className="h-full min-h-64 bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100 flex flex-col items-center justify-center p-8 text-center">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Visit Our Store</h3>
                <p className="text-slate-600 text-sm">123 Flower Street, Anna Nagar</p>
                <p className="text-slate-600 text-sm">Chennai, Tamil Nadu – 600040</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-md transition"
                >
                  <MapPin className="w-4 h-4 text-rose-600" />
                  Open in Maps
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, label: '@flowershop_in', color: 'bg-pink-50 text-pink-600 hover:bg-pink-100' },
                  { icon: Facebook, label: 'FlowerShop India', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
                  { icon: Twitter, label: '@flowershop', color: 'bg-sky-50 text-sky-600 hover:bg-sky-100' },
                ].map((s, i) => {
                  const Icon = s.icon
                  return (
                    <button
                      key={i}
                      className={`flex-1 flex flex-col items-center gap-2 ${s.color} rounded-xl p-4 text-xs font-semibold transition`}
                    >
                      <Icon className="w-5 h-5" />
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Common Questions</h2>
            <p className="text-slate-500">Quick answers to the questions we hear most often.</p>
          </motion.div>
          <div className="space-y-3">
            {contactFaqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition"
                >
                  <span className="font-semibold text-slate-900 text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
