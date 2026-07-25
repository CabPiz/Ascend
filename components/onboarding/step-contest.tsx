"use client"

import * as React from "react"
import {
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
  ScanSearch,
  Rocket,
  Wallet,
  MapPin,
  Users,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { getContest, BOARD_PROFILES, getLocalizedText, getLocalizedList } from "@/lib/curriculum"
import {
  useTranslation,
  formatSalary,
  formatShortDate,
  getDaysLeft,
  getWorkModeLabel,
  interpolate,
} from "@/lib/i18n"
import { CountdownBanner } from "@/components/countdown"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function StepContest() {
  const { state, setOnboardingStep, completeOnboarding, selectContest } = useStore()
  const { t, lang } = useTranslation()
  
  const contest = getContest(state.selectedContestId)

  // Fallback de segurança caso nenhum concurso tenha sido selecionado por limite de cota ou fluxo interrompido
  if (!contest) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto py-4">
        <Card className="border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6 text-center">
            <div className="flex justify-center text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">Nenhum concurso selecionado</h3>
              <p className="text-sm text-muted-foreground">
                {t.contestStep.noSelection || "Por favor, volte e escolha um objetivo ou selecione uma opção rápida abaixo."}
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => selectContest("bb-escriturario")}>
                Banco do Brasil - Escriturário
              </Button>
              <Button variant="outline" size="sm" onClick={() => selectContest("caixa-tecnico")}>
                Caixa Econômica - Técnico
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" onClick={() => setOnboardingStep(1)}>
            <ArrowLeft className="size-4" />
            {t.common.back || "Voltar"}
          </Button>
        </div>
      </div>
    )
  }

  const title = getLocalizedText(contest.title, lang)
  const summary = getLocalizedText(contest.summary, lang)

  const boardProfile = BOARD_PROFILES[contest.board]
  const board = boardProfile
    ? {
        board: boardProfile.board,
        fullName: boardProfile.fullName,
        style: getLocalizedText(boardProfile.style, lang),
        trapPatterns: getLocalizedList(boardProfile.trapPatterns, lang),
      }
    : {
        board: contest.board,
        fullName: contest.board,
        style: t.contestStep.defaultBoardStyle,
        trapPatterns: [t.contestStep.defaultTrap],
      }

  const dateStr = formatShortDate(contest.registrationDeadline, lang)
  const daysLeft = getDaysLeft(contest.registrationDeadline)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground text-pretty">
                  {title}
                </h2>
                <span className="rounded-md bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {contest.board}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">
                {contest.organization}
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {summary}
          </p>

          <div className="flex flex-wrap gap-4 text-sm pt-1">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <Wallet className="size-4" />
              {formatSalary(contest.salary, lang)}/{t.common.month}
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium">
              <MapPin className="size-4" />
              {getWorkModeLabel(contest.workMode, t)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium">
              <Users className="size-4" />
              {contest.vacancies}{" "}
              {contest.vacancies === 1 ? t.common.vacancy : t.common.vacancies}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
            <AlertCircle className="size-5 shrink-0" />
            <span>{t.contestStep.deadlineTitle}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300 border border-amber-500/30">
              <Calendar className="size-3.5" />
              {interpolate(t.contestStep.registrationUntil, { date: dateStr })}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 text-white px-3 py-1 text-xs font-bold shadow-sm">
              <Clock className="size-3.5" />
              {daysLeft > 0
                ? interpolate(t.contestStep.daysLeft, { days: daysLeft })
                : t.contestStep.registrationClosed}
            </span>
          </div>

          <CountdownBanner deadline={contest.registrationDeadline} />

          <div className="pt-1">
            <a
              href={contest.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm px-4 py-2.5 transition-colors w-full sm:w-auto shadow-sm"
            >
              <ExternalLink className="size-4" />
              {t.contestStep.officialPage}
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ScanSearch className="size-4 text-primary" />
            {t.contestStep.boardDetection}
          </div>

          <div className="rounded-lg bg-secondary/60 p-3.5 border border-border/50">
            <p className="text-sm font-bold text-foreground">{board.fullName}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {board.style}
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
              <ShieldAlert className="size-4" />
              {interpolate(t.contestStep.trapPatterns, { board: board.board })}
            </div>
            <ul className="flex flex-col gap-2.5">
              {board.trapPatterns.map((trap, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-lg border border-border bg-background p-3.5 text-sm text-muted-foreground shadow-xs"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{trap}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between pt-2">
        <Button variant="ghost" onClick={() => setOnboardingStep(1)}>
          <ArrowLeft className="size-4" />
          {t.common.back}
        </Button>
        <Button size="lg" onClick={completeOnboarding} className="font-semibold">
          <Rocket className="size-4" />
          {t.contestStep.complete}
        </Button>
      </div>
    </div>
  )
}