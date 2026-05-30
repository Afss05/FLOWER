import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Loader } from 'lucide-react'
import { useVoiceSearch, type UseVoiceSearchOptions, type VoiceSearchStatus } from '@/hooks/useVoiceSearch'

export interface VoiceSearchButtonProps
  extends Omit<UseVoiceSearchOptions, 'onResult'> {
  /** Called with the final recognised text. */
  onResult: (transcript: string) => void
  /** Extra CSS classes for the button wrapper. */
  className?: string
  /** Size variant. */
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<NonNullable<VoiceSearchButtonProps['size']>, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const iconSize: Record<NonNullable<VoiceSearchButtonProps['size']>, number> = {
  sm: 14,
  md: 18,
  lg: 22,
}

const statusColors: Record<VoiceSearchStatus, string> = {
  idle: 'text-gray-500 hover:text-rose-600 hover:bg-rose-50',
  listening: 'text-rose-600 bg-rose-50',
  processing: 'text-rose-400 bg-rose-50',
  error: 'text-orange-500 hover:text-rose-600',
  unsupported: 'text-gray-300 cursor-not-allowed',
}

/**
 * VoiceSearchButton
 *
 * A standalone mic button component that uses the `useVoiceSearch` hook.
 * Supports Tamil (ta-IN) and English (en-IN / en-US) via the `lang` prop.
 *
 * Usage:
 * ```tsx
 * <VoiceSearchButton
 *   lang="ta-IN"
 *   onResult={(text) => setQuery(text)}
 * />
 * ```
 */
export function VoiceSearchButton({
  onResult,
  onError,
  lang = 'ta-IN',
  className = '',
  size = 'md',
}: VoiceSearchButtonProps) {
  const { status, transcript, toggleListening, isSupported } = useVoiceSearch({
    lang,
    onResult,
    onError,
  })

  const title = !isSupported
    ? 'Voice search not supported in this browser'
    : status === 'listening'
    ? `Listening… (${lang === 'ta-IN' ? 'Tamil' : 'English'})`
    : status === 'processing'
    ? 'Processing…'
    : `Voice search (${lang === 'ta-IN' ? 'Tamil' : 'English'})`

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <motion.button
        type="button"
        onClick={toggleListening}
        disabled={!isSupported || status === 'processing'}
        title={title}
        aria-label={title}
        whileHover={isSupported && status !== 'processing' ? { scale: 1.1 } : {}}
        whileTap={isSupported && status !== 'processing' ? { scale: 0.95 } : {}}
        className={`
          relative flex items-center justify-center rounded-full
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-400/50
          ${sizeClasses[size]}
          ${statusColors[status]}
        `}
      >
        {/* Pulse ring when listening */}
        <AnimatePresence>
          {status === 'listening' && (
            <motion.span
              key="pulse"
              initial={{ opacity: 0.7, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-rose-400"
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        {status === 'processing' ? (
          <Loader size={iconSize[size]} className="animate-spin" />
        ) : status === 'listening' ? (
          <MicOff size={iconSize[size]} />
        ) : (
          <Mic size={iconSize[size]} />
        )}
      </motion.button>

      {/* Floating transcript bubble while listening */}
      <AnimatePresence>
        {status === 'listening' && transcript && (
          <motion.div
            key="transcript"
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap
                       bg-gray-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg z-50 max-w-[220px] truncate"
          >
            🎙 {transcript}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
