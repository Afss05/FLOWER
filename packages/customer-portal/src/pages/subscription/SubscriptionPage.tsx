import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Flower2, Truck, Heart, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { Button, Badge } from '@/components/common'
import { usePageTitle } from '@/hooks/usePageTitle'
import { subscriptionPlans, subscriptionFaqs, subscriptionTestimonials } from '@/data'

export default function SubscriptionPage() {
  usePageTitle('Flower Subscriptions')
  const [selected, setSelected] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero */}
      <section className="pt-20 pb-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Flower2 className="w-4 h-4" /> Fresh Flowers Delivered
          </span>
          <h1 className="text-5xl font-bold text-secondary-900 mb-4 leading-tight">
            Never Run Out of <br />
            <span className="text-rose-600">Beautiful Flowers</span>
          </h1>
          <p className="text-secondary-600 text-lg max-w-xl mx-auto mb-8">
            Subscribe and get fresh, hand-curated blooms delivered to your door — every week, fortnight, or month.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-full p-1 shadow-sm mb-10">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${billing === 'monthly' ? 'bg-rose-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${billing === 'yearly' ? 'bg-rose-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Yearly <span className="ml-1.5 text-xs bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
          {subscriptionPlans.map((plan, i) => {
            const isSelected = selected === plan.id
            const popular = plan.tag === 'Most Popular'
            const price = billing === 'yearly' ? Math.round(plan.price * 0.8) : plan.price
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                onClick={() => setSelected(isSelected ? null : plan.id)}
                className={`relative cursor-pointer rounded-3xl border-2 p-7 text-left transition-all ${
                  isSelected
                    ? 'border-rose-500 shadow-xl shadow-rose-100 scale-[1.02]'
                    : popular
                    ? `${plan.border} shadow-lg`
                    : `${plan.border} hover:shadow-md`
                } bg-gradient-to-br ${plan.color}`}
              >
                {plan.tag && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                    plan.tag === 'Most Popular' ? 'bg-rose-600 text-white' : 'bg-purple-600 text-white'
                  }`}>
                    {plan.tag}
                  </div>
                )}

                <div className="text-4xl mb-4">{plan.emoji}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-5">Delivered every {plan.frequency}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-slate-900">₹{price}</span>
                  <span className="text-slate-500 text-sm">/ {plan.frequency}</span>
                </div>

                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isSelected ? 'accent' : popular ? 'accent' : 'secondary'}
                  className="w-full"
                  onClick={e => { e.stopPropagation(); setSelected(plan.id) }}
                >
                  {isSelected ? '✓ Selected' : 'Choose Plan'}
                </Button>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-md mx-auto bg-white border-2 border-rose-200 rounded-2xl p-6 shadow-xl shadow-rose-50 mb-16"
            >
              <p className="font-bold text-slate-900 mb-1">You selected: {subscriptionPlans.find(p => p.id === selected)?.name}</p>
              <p className="text-slate-500 text-sm mb-4">Continue to checkout to start your subscription.</p>
              <Button variant="accent" className="w-full" size="lg">
                Subscribe Now →
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-500 mb-12">Get fresh blooms in three simple steps</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, step: '01', title: 'Pick Your Plan', desc: 'Choose weekly, fortnightly or monthly — and switch anytime.' },
              { icon: Flower2, step: '02', title: 'We Curate', desc: 'Our expert florists handpick the freshest seasonal blooms for you.' },
              { icon: Truck, step: '03', title: 'Delivered Fresh', desc: 'Your bouquet arrives at your door, packaged to stay fresh for days.' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4 relative">
                    <Icon className="w-8 h-8 text-rose-600" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {item.step.slice(-1)}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">What Subscribers Say</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionTestimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-700 text-sm italic mb-5">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                  <Badge variant="accent">{t.plan} Plan</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Frequently Asked Questions</h2>
        </motion.div>
        <div className="space-y-3">
          {subscriptionFaqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
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
      </section>
    </div>
  )
}
