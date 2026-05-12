'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { FlashcardDTO } from '@/lib/api/ai'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface FlashcardDeckProps {
  cards: FlashcardDTO[]
}

export function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const card = cards[index]
  const total = cards.length

  const goNext = () => {
    setFlipped(false)
    setIndex((i) => (i + 1) % total)
  }

  const goPrev = () => {
    setFlipped(false)
    setIndex((i) => (i - 1 + total) % total)
  }

  const reset = () => {
    setIndex(0)
    setFlipped(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span>{index + 1} / {total}</span>
        <button onClick={reset} className="flex items-center gap-1 hover:text-ink transition-colors">
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* Card */}
      <button
        onClick={() => setFlipped(!flipped)}
        className="w-full"
        aria-label={flipped ? 'Show term' : 'Reveal definition'}
      >
        <div className={cn(
          'relative min-h-[160px] rounded-xl border p-6 flex flex-col items-center justify-center text-center transition-all duration-200 select-none cursor-pointer',
          flipped
            ? 'bg-accent/5 border-accent/30'
            : 'bg-muted/30 border-input hover:border-accent/40'
        )}>
          <span className={cn(
            'text-[10px] font-semibold uppercase tracking-widest mb-3',
            flipped ? 'text-accent' : 'text-ink-subtle'
          )}>
            {flipped ? 'Definition' : 'Term'}
          </span>
          <p className={cn(
            'text-sm leading-relaxed font-medium',
            flipped ? 'text-ink' : 'text-ink'
          )}>
            {flipped ? card.definition : card.term}
          </p>
          <span className="mt-4 text-[10px] text-ink-subtle">
            {flipped ? 'click to flip back' : 'click to reveal'}
          </span>
        </div>
      </button>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={goPrev} className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); setFlipped(false) }}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === index ? 'w-4 bg-accent' : 'w-1.5 bg-muted-foreground/30'
              )}
            />
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={goNext} className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
