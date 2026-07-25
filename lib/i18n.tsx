"use client"

import { useStore } from "./store"
import type { Language } from "./types"
import pt from "../locales/pt.json"
import en from "../locales/en.json"
import es from "../locales/es.json"

export type Translations = typeof pt

const translations: Record<Language, Translations> = { pt, en, es }

const localeMap: Record<Language, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-CL",
}

export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template,
  )
}

export function useTranslation() {
  const { state } = useStore()
  const lang: Language = state.language || "pt"
  const t = translations[lang]

  return { t, lang }
}

export function formatSalary(value: number, lang: Language): string {
  return new Intl.NumberFormat(localeMap[lang], {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatShortDate(deadline: string, lang: Language): string {
  return new Date(deadline).toLocaleDateString(localeMap[lang], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  })
}

export function formatLongDate(deadline: string, lang: Language): string {
  return new Date(deadline).toLocaleDateString(localeMap[lang], {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

export function getDaysLeft(deadline: string): number {
  const diffTime = new Date(deadline).getTime() - Date.now()
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

export function getWorkModeLabel(workMode: string, t: Translations): string {
  if (workMode === "100% Remoto" || workMode === "100% Remote") return t.workMode.remote
  if (workMode === "Híbrido" || workMode === "Hybrid") return t.workMode.hybrid
  return t.workMode.onSite
}

export function isRemoteWorkMode(workMode: string): boolean {
  return workMode === "100% Remoto" || workMode === "100% Remote"
}
