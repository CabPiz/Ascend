"use client"

import { Lock, Check, Play } from "lucide-react"
import type { Module } from "@/lib/types"
import { useStore } from "@/lib/store"
import { moduleIcon } from "@/lib/module-meta"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function RoadmapModule({
  module,
  index,
  isLast,
}: {
  module: Module
  index: number
  isLast: boolean
}) {
  const { state, isModuleUnlocked, moduleMastery, navigate } = useStore()
  const unlocked = isModuleUnlocked(module.id)
  const mastery = moduleMastery(module.id)
  const cleared = mastery >= 100
  const Icon = moduleIcon(module.id)

  const status: "locked" | "cleared" | "active" = !unlocked ? "locked" : cleared ? "cleared" : "active"

  const ring =
    status === "cleared"
      ? "border-success/50 bg-success/10 text-success"
      : status === "active"
        ? "border-primary/50 bg-primary/10 text-primary"
        : "border-border bg-muted text-muted-foreground"

  return (
    <li className="relative flex gap-4">
      {/* Connector rail */}
      <div className="flex flex-col items-center">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${ring}`}
          aria-hidden
        >
          {status === "locked" ? (
            <Lock className="size-5" />
          ) : status === "cleared" ? (
            <Check className="size-5" />
          ) : (
            <Icon className="size-5" />
          )}
        </span>
        {!isLast && <span className="mt-1 w-px flex-1 bg-border" aria-hidden />}
      </div>

      {/* Card */}
      <div
        className={`mb-3 flex flex-1 flex-col gap-3 rounded-xl border p-4 transition-colors ${
          status === "locked" ? "border-border/60 bg-card/40" : "border-border bg-card"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium tabular-nums text-muted-foreground">
                Module {String(index + 1).padStart(2, "0")}
              </span>
              {status === "cleared" && (
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">
                  Cleared
                </span>
              )}
              {status === "active" && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                  In progress
                </span>
              )}
            </div>
            <h3
              className={`mt-0.5 truncate text-base font-semibold ${
                status === "locked" ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {module.title}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{module.summary}</p>
          </div>

          <Button
            size="sm"
            variant={status === "cleared" ? "outline" : "default"}
            disabled={status === "locked"}
            onClick={() => navigate({ view: "module", moduleId: module.id })}
            className="shrink-0"
          >
            {status === "locked" ? (
              "Locked"
            ) : status === "cleared" ? (
              "Review"
            ) : (
              <>
                <Play className="size-3.5" />
                {mastery > 0 ? "Resume" : "Start"}
              </>
            )}
          </Button>
        </div>

        {status !== "locked" && (
          <div className="flex items-center gap-3">
            <Progress value={mastery} className="h-1.5" />
            <span className="w-10 shrink-0 text-right text-xs font-medium tabular-nums text-muted-foreground">
              {mastery}%
            </span>
          </div>
        )}

        {status === "locked" && (
          <p className="text-xs text-muted-foreground">
            Clear the previous module at 100% to unlock.
          </p>
        )}
      </div>
    </li>
  )
}
