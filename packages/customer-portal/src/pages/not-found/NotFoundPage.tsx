import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Hammer, ArrowLeft, Sparkles } from 'lucide-react'

export default function NotFoundPage() {
  usePageTitle('Under Construction')

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 relative overflow-hidden">
      {/* Background floating blobs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/5 blur-3xl"
          style={{
            width: `${120 + i * 60}px`,
            height: `${120 + i * 60}px`,
            top: `${10 + i * 18}%`,
            left: `${5 + i * 20}%`,
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Glass popup */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 max-w-md w-full text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '28px',
            padding: '48px 40px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          {/* Icon */}
          <motion.div
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 mb-6 mx-auto"
          >
            <Hammer className="w-10 h-10 text-white" />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Coming Soon
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Under Construction
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-lg mb-8 leading-relaxed"
          >
            We're building something beautiful here. Check back soon — it'll be worth the wait. 🌸
          </motion.p>

          {/* Divider */}
          <div className="w-16 h-0.5 bg-white/20 mx-auto mb-8 rounded-full" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-950 font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
