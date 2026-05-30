import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Clock, User, ArrowRight, Tag, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/common'
import { usePageTitle } from '@/hooks/usePageTitle'
import { blogCategories, blogPosts, blogCategoryColors } from '@/data'

export default function BlogsPage() {
  usePageTitle('Blog & Flower Stories')
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)

  const featured = blogPosts.find(p => p.featured)!
  const rest = blogPosts.filter(p => !p.featured)

  const filtered = (expanded ? blogPosts : rest).filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    const matchesSearch = query === '' || p.title.toLowerCase().includes(query.toLowerCase()) || p.excerpt.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const showFeatured = activeCategory === 'All' && query === ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero */}
      <section className="pt-20 pb-10 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🌿 Flower Stories & Tips
          </span>
          <h1 className="text-5xl font-bold text-secondary-900 mb-4">The Bloom Journal</h1>
          <p className="text-secondary-600 text-lg max-w-xl mx-auto mb-8">
            Expert care tips, floral inspiration, seasonal guides and behind-the-scenes stories from our florists.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition"
            />
          </div>
        </motion.div>
      </section>

      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 max-w-5xl mx-auto pb-2 mb-8 no-scrollbar">
        {blogCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeCategory === cat
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        {/* Featured Post */}
        {showFeatured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-10 group cursor-pointer"
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative overflow-hidden h-64 lg:h-auto">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${blogCategoryColors[featured.category]}`}>
                    ★ Featured
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className={`inline-block self-start px-3 py-1 rounded-full text-xs font-semibold mb-4 ${blogCategoryColors[featured.category]}`}>
                  {featured.category}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-rose-700 transition">{featured.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{featured.author}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
                  <span>{featured.date}</span>
                </div>
                <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-slate-600 font-medium">No articles found for "{query}"</p>
            <button onClick={() => setQuery('')} className="mt-3 text-rose-600 text-sm font-semibold underline">Clear search</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${blogCategoryColors[post.category]}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 group-hover:text-rose-700 transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {post.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-md">
                        <Tag className="w-2.5 h-2.5" />{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load more */}
        {activeCategory === 'All' && query === '' && !expanded && (
          <div className="text-center mt-10">
            <button
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:shadow-md hover:border-rose-300 transition text-sm"
            >
              Load More Articles <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-rose-600 to-pink-600 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="text-4xl mb-4">💌</div>
          <h2 className="text-3xl font-bold text-white mb-3">Never Miss a Bloom Tip</h2>
          <p className="text-rose-100 mb-8">Get our best articles, seasonal guides, and exclusive offers straight to your inbox.</p>
          <div className="flex gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-slate-400"
            />
            <button className="bg-white text-rose-600 font-bold px-5 py-3 rounded-xl text-sm hover:bg-rose-50 transition flex-shrink-0">
              Subscribe
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
