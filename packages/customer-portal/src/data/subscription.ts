export interface SubscriptionPlan {
  id: string
  name: string
  emoji: string
  price: number
  frequency: string
  tag: string | null
  color: string
  border: string
  features: string[]
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'weekly',
    name: 'Weekly Blooms',
    emoji: '🌷',
    price: 399,
    frequency: 'week',
    tag: null,
    color: 'from-pink-50 to-rose-50',
    border: 'border-pink-200',
    features: [
      'Fresh seasonal bouquet every week',
      'Free delivery on all orders',
      'Handpicked by our florists',
      'Skip or pause anytime',
      'Priority customer support',
    ],
  },
  {
    id: 'biweekly',
    name: 'Fortnightly Fresh',
    emoji: '🌸',
    price: 699,
    frequency: '2 weeks',
    tag: 'Most Popular',
    color: 'from-rose-50 to-pink-100',
    border: 'border-rose-400',
    features: [
      'Large premium bouquet every 2 weeks',
      'Free delivery on all orders',
      'Handpicked by our florists',
      'Mix of seasonal & exotic flowers',
      'Skip or pause anytime',
      'Dedicated subscription manager',
    ],
  },
  {
    id: 'monthly',
    name: 'Monthly Luxe',
    emoji: '🌹',
    price: 1299,
    frequency: 'month',
    tag: 'Best Value',
    color: 'from-purple-50 to-indigo-50',
    border: 'border-purple-200',
    features: [
      'Grand luxury arrangement monthly',
      'Free express delivery',
      'Handpicked by our florists',
      'Exclusive rare & exotic selections',
      'Skip or pause anytime',
      'Personal floral consultant',
      'Birthday & anniversary reminders',
    ],
  },
]

export const subscriptionFaqs = [
  {
    q: 'Can I pause or cancel my subscription?',
    a: 'Yes! You can pause, skip a delivery, or cancel your subscription anytime from your profile page. No questions asked, no cancellation fees.',
  },
  {
    q: 'When will my first delivery arrive?',
    a: 'Your first delivery is scheduled within 2 working days of subscribing. Subsequent deliveries follow the frequency you chose (weekly, fortnightly, or monthly).',
  },
  {
    q: 'Can I choose specific flowers?',
    a: 'Our curated plans deliver seasonal selections chosen by our expert florists. If you have specific preferences or allergies, you can add a note to your order.',
  },
  {
    q: 'Is there a delivery charge?',
    a: "All subscription plans include free delivery. For addresses outside our regular delivery zones, a small surcharge may apply — we'll notify you before confirming.",
  },
  {
    q: 'Can I gift a subscription?',
    a: "Absolutely! You can gift any plan to someone special. At checkout just add the recipient's address and a personal message.",
  },
]

export const subscriptionTestimonials = [
  { name: 'Priya S.',  plan: 'Weekly',      quote: 'My home always smells amazing! The florists have great taste — every bouquet is a surprise.' },
  { name: 'Arun M.',   plan: 'Monthly',     quote: 'I subscribed for my mom and she absolutely loves it. Best gift decision ever!' },
  { name: 'Deepa R.',  plan: 'Fortnightly', quote: 'Super fresh flowers, excellent packaging, and the customer service is genuinely caring.' },
]
