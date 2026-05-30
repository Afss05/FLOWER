export interface BlogPost {
  id: number
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  image: string
  featured: boolean
  tags: string[]
}

export const blogCategories = ['All', 'Care Tips', 'Occasions', 'DIY', 'Seasonal', 'Gifting']

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '10 Ways to Make Your Roses Last Longer',
    excerpt: 'Discover professional florist secrets that can keep your fresh roses blooming beautifully for up to two weeks. From water temperature to cutting techniques.',
    category: 'Care Tips',
    author: 'Meena Krishnan',
    date: 'May 25, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=600&h=360&fit=crop',
    featured: true,
    tags: ['Roses', 'Care', 'Tips'],
  },
  {
    id: 2,
    title: 'Best Flowers for a Tamil Wedding: A Complete Guide',
    excerpt: 'From jasmine garlands to marigold mandaps — explore the traditional and modern floral choices that make South Indian weddings unforgettable.',
    category: 'Occasions',
    author: 'Ravi Subramaniam',
    date: 'May 22, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&h=360&fit=crop',
    featured: false,
    tags: ['Wedding', 'Traditions', 'Jasmine'],
  },
  {
    id: 3,
    title: 'DIY Flower Crown Tutorial for Summer Festivals',
    excerpt: 'Step-by-step guide to making a gorgeous, long-lasting flower crown with materials available at any local flower market.',
    category: 'DIY',
    author: 'Priya Anand',
    date: 'May 18, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&h=360&fit=crop',
    featured: false,
    tags: ['DIY', 'Flower Crown', 'Festival'],
  },
  {
    id: 4,
    title: 'Monsoon Florals: Which Flowers Thrive in the Rains',
    excerpt: 'Not all flowers handle humidity well. Here are the most beautiful varieties that actually flourish during the Chennai monsoon season.',
    category: 'Seasonal',
    author: 'Suresh Nair',
    date: 'May 14, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1477554193778-9562c28588c0?w=600&h=360&fit=crop',
    featured: false,
    tags: ['Monsoon', 'Seasonal', 'Care'],
  },
  {
    id: 5,
    title: 'Flowers That Say "I Love You" Without Words',
    excerpt: 'The language of flowers (floriography) is ancient and poetic. We break down the most romantic blooms and what each one quietly whispers.',
    category: 'Gifting',
    author: 'Ananya Raj',
    date: 'May 10, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&h=360&fit=crop',
    featured: false,
    tags: ['Gifting', 'Romance', 'Meaning'],
  },
  {
    id: 6,
    title: 'How to Build a Stunning Pooja Thali at Home',
    excerpt: 'A beautifully arranged pooja thali elevates your daily rituals. Learn to combine marigolds, jasmine, lotus, and other auspicious flowers perfectly.',
    category: 'Occasions',
    author: 'Meena Krishnan',
    date: 'May 6, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=600&h=360&fit=crop',
    featured: false,
    tags: ['Pooja', 'Traditions', 'DIY'],
  },
  {
    id: 7,
    title: 'Succulent Arrangements: Low Maintenance, High Style',
    excerpt: 'Succulents are taking over modern home décor. Here is how to mix them with fresh flowers for arrangements that last months, not days.',
    category: 'Care Tips',
    author: 'Karthik Venkat',
    date: 'Apr 30, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&h=360&fit=crop',
    featured: false,
    tags: ['Succulents', 'Décor', 'Low Maintenance'],
  },
]

export const blogCategoryColors: Record<string, string> = {
  'Care Tips': 'bg-emerald-100 text-emerald-700',
  'Occasions': 'bg-purple-100 text-purple-700',
  'DIY':       'bg-amber-100 text-amber-700',
  'Seasonal':  'bg-sky-100 text-sky-700',
  'Gifting':   'bg-rose-100 text-rose-700',
  'All':       'bg-slate-100 text-slate-700',
}
