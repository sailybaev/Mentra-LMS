'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Terminal, ArrowRight } from 'lucide-react'
import { QuizDTO } from '@/types/quiz'

type DemoState = 'idle' | 'authing' | 'finding_lesson' | 'generating' | 'result' | 'error'

const steps = [
  { key: 'authing', label: 'Authenticating...' },
  { key: 'finding_lesson', label: 'Finding lesson content...' },
  { key: 'generating', label: 'Generating with AI...' },
]

export function AIDemoSection() {
  const [state, setState] = useState<DemoState>('idle')
  const [form, setForm] = useState({ org_slug: '', email: '', password: '' })
  const [quiz, setQuiz] = useState<QuizDTO | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const currentStep = steps.findIndex((s) => s.key === state)

  const handleRun = async () => {
    if (!form.org_slug || !form.email || !form.password) return
    setState('authing')
    setErrorMsg('')
    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Demo failed. Check your credentials.')
        setState('error')
        return
      }
      setState('finding_lesson')
      await new Promise((r) => setTimeout(r, 600))
      setState('generating')
      await new Promise((r) => setTimeout(r, 500))
      if (data.quiz) {
        setQuiz(data.quiz)
        setState('result')
      } else {
        setErrorMsg(data.error ?? 'No lesson content found.')
        setState('error')
      }
    } catch {
      setErrorMsg('Connection error. Make sure the backend is running.')
      setState('error')
    }
  }

  return (
    <section id="demo" className="relative py-28 px-6 overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute inset-0 dot-grid opacity-[0.03]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-96 bg-indigo-500/20 blur-[100px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-400">
            <Terminal className="h-3.5 w-3.5" />
            Live demo
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            See the AI work in real time
          </h2>
          <p className="mt-4 text-zinc-400">
            Enter your credentials. Watch Mentra authenticate, find your lesson, and generate a quiz — live.
          </p>
        </motion.div>

        {/* Terminal card */}
        <motion.div
          className="rounded-2xl border border-white/[0.06] bg-zinc-900 overflow-hidden shadow-2xl shadow-black/50"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 border-b border-white/[0.05] bg-zinc-800/60 px-5 py-3.5">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-amber-500/60" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
            </div>
            <div className="flex-1 text-center text-xs text-zinc-500 font-mono">mentra — ai demo</div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {state === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  <p className="font-mono text-sm text-zinc-500">$ mentra demo --generate-quiz</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                      { key: 'org_slug', placeholder: 'org-slug', label: 'Organization' },
                      { key: 'email', placeholder: 'you@org.com', label: 'Email' },
                      { key: 'password', placeholder: '••••••••', label: 'Password', type: 'password' },
                    ].map(({ key, placeholder, label, type }) => (
                      <div key={key}>
                        <label className="block mb-1.5 text-xs text-zinc-500 font-mono">{label}</label>
                        <input
                          type={type ?? 'text'}
                          placeholder={placeholder}
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                          className="w-full rounded-lg border border-white/[0.08] bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 font-mono focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  <motion.button
                    onClick={handleRun}
                    disabled={!form.org_slug || !form.email || !form.password}
                    className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '150%' }}
                      transition={{ duration: 0.5 }}
                    />
                    <Sparkles className="h-4 w-4" />
                    Generate quiz from my first lesson
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </motion.button>
                </motion.div>
              )}

              {(state === 'authing' || state === 'finding_lesson' || state === 'generating') && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6 font-mono text-sm"
                >
                  {steps.map((step, i) => {
                    const done = i < currentStep
                    const active = i === currentStep
                    return (
                      <motion.div
                        key={step.key}
                        className={`flex items-center gap-3 py-1.5 ${done ? 'text-emerald-400' : active ? 'text-white' : 'text-zinc-600'}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                        ) : active ? (
                          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                        ) : (
                          <div className="h-4 w-4 shrink-0 rounded-full border border-zinc-600" />
                        )}
                        {step.label}
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}

              {state === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                    <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300 font-mono">{errorMsg}</p>
                  </div>
                  <button
                    onClick={() => setState('idle')}
                    className="text-sm text-zinc-400 hover:text-white font-mono transition-colors"
                  >
                    ↩ try again
                  </button>
                </motion.div>
              )}

              {state === 'result' && quiz && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-sm font-mono text-emerald-400 mb-4">
                    <CheckCircle2 className="h-4 w-4" />
                    Generated {quiz.questions.length} questions in &lt;3s
                  </div>
                  {quiz.questions.map((q, i) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className="rounded-xl border border-white/[0.06] bg-zinc-800/60 p-4"
                    >
                      <p className="text-sm font-medium text-white mb-3">{i + 1}. {q.question}</p>
                      <div className="space-y-1.5">
                        {q.answers.map((a) => (
                          <div
                            key={a.id}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono ${
                              a.is_correct
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                                : 'bg-zinc-800 text-zinc-500 border border-transparent'
                            }`}
                          >
                            <div className={`h-1.5 w-1.5 rounded-full ${a.is_correct ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                            {a.answer}
                            {a.is_correct && <span className="ml-auto text-emerald-500">✓ correct</span>}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                  <button
                    onClick={() => { setState('idle'); setQuiz(null) }}
                    className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
                  >
                    ↩ run again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
