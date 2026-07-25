import { GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
export function Brand({ className, compact = false, showLanguageSelector = true }: { className?: string; compact?: boolean; showLanguageSelector?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="size-5" />
        </span>
        {!compact && (
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-foreground">AscendIT</p>
            <p className="text-[11px] text-muted-foreground">Preparação Adaptativa para Provas</p>
          </div>
        )}
      </div>
    </div>
  )
}