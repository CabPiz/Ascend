"use client"

import * as React from "react"
import { Send, GraduationCap, Sparkles } from "lucide-react"
import type { Module, ChatMessage } from "@/lib/types"
import { Button } from "@/components/ui/button"

/**
 * A lightweight "AI Professor" that answers questions by matching keywords
 * against the module's own theory sections. Fully offline / deterministic
 * so it works with no backend, per the localStorage-only requirement.
 */
function answer(module: Module, question: string): string {
  const q = question.toLowerCase()
  const words = q.split(/\W+/).filter((w) => w.length > 3)

  // Score each theory section by keyword overlap.
  let best: { section: (typeof module.theory)[number]; score: number } | null = null
  for (const section of module.theory) {
    const haystack = (section.heading + " " + section.body).toLowerCase()
    let score = 0
    for (const w of words) {
      if (haystack.includes(w)) score += 1
    }
    if (!best || score > best.score) best = { section, score }
  }

  if (!best || best.score === 0) {
    return `Great question. For "${module.title}", focus on the core concepts in the theory sections above. Try asking about a specific term you saw, and I'll pull the relevant explanation.`
  }

  return `On "${best.section.heading}": ${best.section.body}`
}

const SUGGESTIONS = ["Explain the key idea simply", "How is this tested on the exam?", "Give me a memory hook"]

export function ProfessorChat({ module }: { module: Module }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: "professor",
      content: `Hi! I'm your professor for ${module.title}. Ask me anything about this module and I'll explain it using the material.`,
    },
  ])
  const [input, setInput] = React.useState("")
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    const reply = answer(module, trimmed)
    setMessages((m) => [...m, { role: "user", content: trimmed }, { role: "professor", content: reply }])
    setInput("")
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <GraduationCap className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">AI Professor</p>
          <p className="text-xs text-muted-foreground">Grounded in this module</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground"
                  : "max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary px-3.5 py-2 text-sm leading-relaxed text-secondary-foreground"
              }
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 px-4 pb-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <Sparkles className="size-3" />
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask the professor..."
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <Button size="icon" onClick={() => send(input)} aria-label="Send message">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  )
}
