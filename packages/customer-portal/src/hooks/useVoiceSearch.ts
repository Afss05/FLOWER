import { useState, useEffect, useRef, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Web Speech API minimal typings (not yet universal in TS DOM lib)
// ---------------------------------------------------------------------------
interface ISpeechRecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  item(index: number): { readonly transcript: string }
  [index: number]: { readonly transcript: string }
}

interface ISpeechRecognitionResultList {
  readonly length: number
  item(index: number): ISpeechRecognitionResult
  [index: number]: ISpeechRecognitionResult
}

interface ISpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: ISpeechRecognitionResultList
}

interface ISpeechRecognitionErrorEvent extends Event {
  readonly error: string
}

interface ISpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onstart: ((ev: Event) => void) | null
  onresult: ((ev: ISpeechRecognitionEvent) => void) | null
  onerror: ((ev: ISpeechRecognitionErrorEvent) => void) | null
  onend: ((ev: Event) => void) | null
  start(): void
  stop(): void
  abort(): void
}

type ISpeechRecognitionConstructor = new () => ISpeechRecognition

// ---------------------------------------------------------------------------

export type VoiceSearchStatus = 'idle' | 'listening' | 'processing' | 'error' | 'unsupported'

export interface UseVoiceSearchOptions {
  /** Language for recognition. Defaults to Tamil (India). */
  lang?: 'ta-IN' | 'en-US'
  /** Called whenever a final transcript is ready. */
  onResult: (transcript: string) => void
  /** Called when an error occurs. */
  onError?: (error: string) => void
}

export interface UseVoiceSearchReturn {
  status: VoiceSearchStatus
  transcript: string
  isListening: boolean
  startListening: () => void
  stopListening: () => void
  toggleListening: () => void
  isSupported: boolean
}

export function useVoiceSearch({
  lang = 'ta-IN',
  onResult,
  onError,
}: UseVoiceSearchOptions): UseVoiceSearchReturn {
  const [status, setStatus] = useState<VoiceSearchStatus>('idle')
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<ISpeechRecognition | null>(null)

  // Synchronous ref update — always holds latest callbacks without stale closures.
  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)
  onResultRef.current = onResult
  onErrorRef.current = onError

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort()
      recognitionRef.current = null
    }
    setStatus('idle')
    setTranscript('')
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported) {
      setStatus('unsupported')
      onErrorRef.current?.('Voice search not supported. Please use Chrome or Edge.')
      return
    }

    // Abort any in-flight session
    if (recognitionRef.current) {
      recognitionRef.current.abort()
      recognitionRef.current = null
    }

    const SpeechRecognitionAPI: ISpeechRecognitionConstructor | undefined =
      (window as unknown as { SpeechRecognition?: ISpeechRecognitionConstructor; webkitSpeechRecognition?: ISpeechRecognitionConstructor })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: ISpeechRecognitionConstructor }).webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      setStatus('unsupported')
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 3

    // Snapshot callbacks at call-time so closures below are never stale
    const deliverResult = onResultRef.current
    const deliverError = onErrorRef.current

    // Per-session local state — fresh on every startListening() call
    let lastText = ''
    let delivered = false

    const tryDeliver = (text: string) => {
      if (!delivered && text.trim()) {
        delivered = true
        deliverResult(text.trim())
      }
    }

    recognition.onstart = () => {
      setStatus('listening')
      setTranscript('')
    }

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i]
        const text = r[0].transcript
        if (r.isFinal) {
          final += text
        } else {
          interim += text
        }
      }

      const current = final || interim
      if (current) {
        lastText = current
        setTranscript(current)
      }

      if (final) {
        setStatus('processing')
        tryDeliver(final)
      }
    }

    recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
      if (event.error === 'aborted') return
      const messages: Record<string, string> = {
        'not-allowed': 'Microphone permission denied.',
        'no-speech': 'No speech detected. Try again.',
        'audio-capture': 'Microphone not found.',
        'network': 'Network error. Check internet connection.',
      }
      const msg = messages[event.error] ?? `Speech error: ${event.error}`
      setStatus('error')
      deliverError?.(msg)
    }

    recognition.onend = () => {
      // Fallback: if isFinal never fired, deliver the last interim transcript
      tryDeliver(lastText)
      setStatus('idle')
      recognitionRef.current = null
    }

    try {
      recognitionRef.current = recognition
      recognition.start()
    } catch {
      setStatus('error')
      deliverError?.('Failed to start voice recognition.')
      recognitionRef.current = null
    }
  }, [isSupported, lang])

  const toggleListening = useCallback(() => {
    if (status === 'listening') {
      stopListening()
    } else {
      startListening()
    }
  }, [status, startListening, stopListening])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
    }
  }, [])

  return {
    status,
    transcript,
    isListening: status === 'listening',
    startListening,
    stopListening,
    toggleListening,
    isSupported,
  }
}

