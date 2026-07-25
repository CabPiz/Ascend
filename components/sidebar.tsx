"use client"

import * as React from "react"
import {
  LayoutDashboard,
  FileCheck2,
  RotateCcw,
  Menu,
  X,
  Building2,
  ExternalLink,
  UserCheck,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { getContest, getLocalizedText } from "@/lib/curriculum"
import { useTranslation, formatShortDate, getDaysLeft, interpolate } from "@/lib/i18n"
import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { state, setActiveView, resetProgress, overallMastery } = useStore()
  const { t, lang } = useTranslation()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const contest = getContest(state.selectedContestId)

  const navItems = [
    { id: "dashboard" as const, label: t.sidebar.studyPanel, icon: LayoutDashboard },
    { id: "simulation" as const, label: t.sidebar.examSimulations, icon: FileCheck2 },
    { id: "profile" as const, label: "Perfil do Candidato", icon: UserCheck }, // Nova seção
  ]

  const isActive = (id: string) =>
    state.activeView === id || (id === "dashboard" && state.activeView === "module")

  function go(view: "dashboard" | "simulation" | "profile") {
    setActiveView(view)
    setMobileOpen(false)
  }

  const contestTitle = contest ? getLocalizedText(contest.title, lang) : ""
  const deadlineDate = contest
    ? formatShortDate(contest.registrationDeadline, lang)
    : ""
  const daysLeft = contest ? getDaysLeft(contest.registrationDeadline) : 0

  const content = (
    <div className="flex h-full flex-col gap-6 p-4">
      <Brand />

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                isActive(item.id)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {t.sidebar.overallMastery}
        </p>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-3xl font-semibold tabular-nums text-foreground">
            {overallMastery}%
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${overallMastery}%` }}
          />
        </div>
      </div>

      {contest && (
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="size-4" />
              <span className="text-[11px] font-medium uppercase tracking-wide">
                {t.sidebar.targetContest}
              </span>
            </div>
            <p className="mt-1.5 text-sm font-semibold leading-snug text-foreground text-pretty">
              {contestTitle}
            </p>
            <p className="text-xs text-muted-foreground">{contest.organization}</p>
            <span className="mt-2 inline-flex rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
              {contest.board}
            </span>
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  {interpolate(t.sidebar.registrationUntil, { date: deadlineDate })}
                </span>
                <span className="shrink-0 rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  {interpolate(t.sidebar.daysLeft, { days: daysLeft })}
                </span>
              </div>
            </div>

            <a
              href={contest.registrationLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:underline dark:text-amber-300 pt-1 border-t border-amber-500/20"
            >
              <ExternalLink className="size-3.5 shrink-0" />
              {t.sidebar.officialRegistration}
            </a>
          </div>
        </div>
      )}

      <div className="mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={() => {
            if (confirm(t.sidebar.resetConfirm)) resetProgress()
          }}
        >
          <RotateCcw className="size-4" />
          {t.sidebar.resetProgress}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {state.onboardingComplete && (
        <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 md:hidden">
          <Brand />
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setMobileOpen(true)}
            aria-label={t.sidebar.openMenu}
          >
            <Menu className="size-4" />
          </Button>
        </div>
      )}
      
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-border bg-sidebar">
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-3 top-3"
              onClick={() => setMobileOpen(false)}
              aria-label={t.sidebar.closeMenu}
            >
              <X className="size-4" />
            </Button>
            {content}
          </div>
        </div>
      )}

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border bg-sidebar md:block">
        {content}
      </aside>
    </>
  )
}
