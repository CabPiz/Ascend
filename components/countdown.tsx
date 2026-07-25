"use client"

import * as React from "react"
import { AlarmClock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation, formatLongDate } from "@/lib/i18n"

function getRemaining(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now()
  const clamped = Math.max(0, diff)
  const days = Math.floor(clamped / 86400000)
  const hours = Math.floor((clamped % 86400000) / 3600000)
  const minutes = Math.floor((clamped % 3600000) / 60000)
  const seconds = Math.floor((clamped % 60000) / 1000)
  return { days, hours, minutes, seconds, expired: diff <= 0 }
}

export function CountdownBanner({ deadline, className }: { deadline: string; className?: string }) {
  const { t, lang } = useTranslation()
  const [remaining, setRemaining] = React.useState(() => getRemaining(deadline))

  React.useEffect(() => {
    const timer = setInterval(() => setRemaining(getRemaining(deadline)), 1000)
    return () => clearInterval(timer)
  }, [deadline])

  const units = [
    { label: t.countdown.days, value: remaining.days },
    { label: t.countdown.hours, value: remaining.hours },
    { label: t.countdown.minutes, value: remaining.minutes },
    { label: t.countdown.seconds, value: remaining.seconds },
  ]

  const urgent = remaining.days <= 10

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
        urgent ? "border-warning/40 bg-warning/10" : "border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            urgent ? "bg-warning/20 text-warning" : "bg-primary/15 text-primary",
          )}
        >
          <AlarmClock className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {remaining.expired ? t.countdown.expired : t.countdown.deadline}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatLongDate(deadline, lang)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {units.map((u) => (
          <div
            key={u.label}
            className="flex min-w-14 flex-col items-center rounded-lg bg-background/60 px-2 py-1.5"
          >
            <span
              className={cn(
                "text-xl font-semibold tabular-nums",
                urgent ? "text-warning" : "text-foreground",
              )}
            >
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
