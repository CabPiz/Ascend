"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Globe } from "lucide-react"
import { useStore } from "@/lib/store"

interface LanguageOption {
  code: string
  label: string
  flag: string
}

const languageOptions: LanguageOption[] = [
  { code: 'pt', label: 'PT', flag: '\u{1F1E7}\u{1F1F7}' }, // 🇧🇷 (B + R)
  { code: 'es', label: 'ES', flag: '\u{1F1E8}\u{1F1F1}' }, // 🇨🇱 (C + L)
  { code: 'en', label: 'EN', flag: '\u{1F1FA}\u{1F1F8}' }, // 🇺🇸 (U + S)
]

export function LanguageSelector() {
  const { state, setLanguage } = useStore()
  const currentLang = state.language || "pt"
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-secondary/80 border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer shadow-xs"
        aria-expanded={isOpen}
      >
        <Globe className="size-4 text-primary shrink-0" />
        <span className="uppercase">{currentLang}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-28 origin-top-right rounded-lg border border-border bg-card shadow-lg ring-1 ring-black/5 z-50 py-1">
          {languageOptions.map((option) => {
            const isSelected = currentLang === option.code
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => handleLanguageChange(option.code)}
                className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  isSelected ? "bg-primary/10 text-primary font-bold" : "text-foreground"
                }`}
              >
                <span>{option.label}</span>
                <span className="text-sm">{option.flag}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}