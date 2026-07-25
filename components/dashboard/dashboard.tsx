"use client"

import * as React from "react"
import {
  Trophy,
  TriangleAlert,
  CalendarClock,
  Layers,
  ArrowRight,
  X,
  Target,
  CheckCircle2,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { MODULES, getContest, getLocalizedText } from "@/lib/curriculum"
import { useTranslation, interpolate } from "@/lib/i18n"
import { MasteryRing } from "@/components/mastery-ring"
import { RoadmapModule } from "@/components/dashboard/roadmap-module"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Dashboard() {
  const { state, overallMastery, masteredCount } = useStore()
  const { t, lang } = useTranslation()
  const contest = getContest(state.selectedContestId)

  const [isWeakTopicsOpen, setIsWeakTopicsOpen] = React.useState(false)

  const weakTopicsList = Array.from(new Set(state.reviewQueue.map((r) => r.topic)))
  const nextReview = state.reviewQueue.length > 0 ? t.dashboard.pendingToday : t.dashboard.allCaughtUp

  const candidateFirstName = state.candidate?.name
    ? state.candidate.name.split(" ")[0]
    : t.dashboard.candidate

  const contestTitle = contest ? getLocalizedText(contest.title, lang) : ""

  const metrics = [
    {
      id: "modules",
      label: t.dashboard.modulesCompleted,
      value: `${masteredCount} / ${MODULES.length}`,
      icon: Layers,
      accent: "text-primary",
      bg: "bg-primary/15",
      clickable: false,
    },
    {
      id: "weak-topics",
      label: t.dashboard.weakTopics,
      value: `${weakTopicsList.length} ${weakTopicsList.length === 1 ? t.dashboard.topic : t.dashboard.topics}`,
      icon: TriangleAlert,
      accent: "text-warning",
      bg: "bg-warning/15",
      clickable: true,
      onClick: () => setIsWeakTopicsOpen(true),
      hint: t.dashboard.clickToPractice,
    },
    {
      id: "next-review",
      label: t.dashboard.nextReview,
      value: nextReview,
      icon: CalendarClock,
      accent: state.reviewQueue.length > 0 ? "text-warning" : "text-success",
      bg: state.reviewQueue.length > 0 ? "bg-warning/15" : "bg-success/15",
      clickable: false,
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          {contest
            ? interpolate(t.dashboard.preparingFor, {
                title: contestTitle,
                org: contest.organization,
              })
            : t.dashboard.adaptivePanel}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl">
          {interpolate(t.dashboard.welcomeBack, { name: candidateFirstName })}
        </h1>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="md:row-span-1">
          <CardContent className="flex items-center gap-4 p-5">
            <MasteryRing value={overallMastery} size={92} />
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Trophy className="size-4 text-primary" />
                {t.dashboard.overallMastery}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">
                {overallMastery === 0
                  ? t.dashboard.masteryStart
                  : overallMastery === 100
                  ? t.dashboard.masteryComplete
                  : t.dashboard.masteryProgress}
              </p>
            </div>
          </CardContent>
        </Card>

        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <Card
              key={m.id}
              onClick={m.clickable ? m.onClick : undefined}
              className={
                m.clickable
                  ? "group cursor-pointer transition-all hover:border-primary/50 hover:bg-card/80 hover:shadow-md"
                  : ""
              }
            >
              <CardContent className="flex flex-col justify-between gap-3 p-5">
                <div className="flex items-center justify-between">
                  <span
                    className={`flex size-9 items-center justify-center rounded-lg ${m.bg} ${m.accent}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  {m.clickable && (
                    <span className="text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      {m.hint} →
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums text-foreground">
                    {m.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {t.dashboard.learningPath}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t.dashboard.learningPathHint}
            </p>
          </div>
        </div>

        <ol className="flex flex-col gap-3">
          {MODULES.map((mod, i) => (
            <RoadmapModule
              key={mod.id}
              module={mod}
              index={i}
              isLast={i === MODULES.length - 1}
            />
          ))}
        </ol>

        {overallMastery === 100 && (
          <div className="flex items-center gap-3 rounded-xl border border-success/40 bg-success/10 p-4 text-sm text-foreground">
            <Trophy className="size-5 text-success shrink-0" />
            <span>{t.dashboard.allMastered}</span>
            <ArrowRight className="size-4 text-success shrink-0" />
          </div>
        )}
      </section>

      {isWeakTopicsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-warning/15 text-warning">
                  <TriangleAlert className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t.dashboard.weakTopicsTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {t.dashboard.weakTopicsHint}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsWeakTopicsOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="my-4 max-h-[60vh] overflow-y-auto flex flex-col gap-3 pr-1">
              {weakTopicsList.length > 0 ? (
                weakTopicsList.map((topic, idx) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 p-3.5 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {topic}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1.5 shrink-0"
                      onClick={() => setIsWeakTopicsOpen(false)}
                    >
                      <Target className="size-3.5" />
                      {t.dashboard.practiceNow}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                  <CheckCircle2 className="size-8 text-success" />
                  <p>{t.dashboard.noWeakTopics}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-border">
              <Button variant="outline" onClick={() => setIsWeakTopicsOpen(false)}>
                {t.dashboard.close}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
