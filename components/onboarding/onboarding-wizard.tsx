"use client"

import { useState } from "react"
import { Check, AlertCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import { useTranslation, interpolate } from "@/lib/i18n"
import { Brand } from "@/components/brand"
import { StepUpload } from "@/components/onboarding/step-upload"
import { StepGoals } from "@/components/onboarding/step-goals"
import { StepContest } from "@/components/onboarding/step-contest"
import { LanguageSelector } from "@/components/language-selector"
import { cn } from "@/lib/utils"
import { extractTextFromPDF, analyzeProfileWithGemini } from "@/lib/gemini-parser"

export function OnboardingWizard() {
  const { state, setOnboardingStep } = useStore()
  const { t } = useTranslation()
  const step = state.onboardingStep

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [fullExtractedText, setFullExtractedText] = useState("")
  const [rateLimitError, setRateLimitError] = useState<{ message: string; retryAfterSeconds: number } | null>(null)

  const handleAnalyzeFiles = async (files: File[]) => {
    if (!files || files.length === 0) return
    setIsAnalyzing(true)
    setRateLimitError(null)

    try {
      const extractedTexts: string[] = []

      for (const file of files) {
        try {
          let text = ""
          if (file.type === "application/pdf") {
            text = await extractTextFromPDF(file)
          } else {
            text = await file.text()
          }
          if (text) extractedTexts.push(`--- ARQUIVO: ${file.name} ---\n${text}`)
        } catch (err) {
          console.error(`Erro ao processar arquivo ${file.name}:`, err)
        }
      }

      const combinedText = extractedTexts.join("\n\n")
      setFullExtractedText(combinedText)

      const analysis = await analyzeProfileWithGemini(combinedText)
      setProfileData(analysis)
    } catch (error: any) {
      console.error("Erro na análise dos arquivos:", error)
      
      const errorStr = error?.message || String(error)
      if (errorStr.includes("429") || errorStr.includes("Rate limit")) {
        // Tenta extrair os segundos ou minutos informados no erro da API
        const matchMinutes = errorStr.match(/try again in (\d+)m([\d.]+)s/)
        const matchSeconds = errorStr.match(/try again in ([\d.]+)s/)
        
        let totalSeconds = 600 // Padrão de 10 minutos caso não encontre
        if (matchMinutes) {
          const mins = parseInt(matchMinutes[1], 10)
          const secs = parseFloat(matchMinutes[2])
          totalSeconds = Math.ceil(mins * 60 + secs)
        } else if (matchSeconds) {
          totalSeconds = Math.ceil(parseFloat(matchSeconds[1]))
        }

        setRateLimitError({
          message: `Limite de requisições excedido. Cota esgotada no momento.`,
          retryAfterSeconds: totalSeconds
        })
      } else {
        setRateLimitError({
          message: errorStr || "Erro ao processar análise do perfil.",
          retryAfterSeconds: 0
        })
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div key="onboarding-wizard-root" className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Brand />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground hidden sm:block">
            {interpolate(t.onboarding.stepProgress, {
              current: step + 1,
              total: t.onboarding.steps.length,
            })}
          </div>
          <LanguageSelector />
        </div>
      </header>

      <div className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col gap-8">
        <header aria-label="Progresso do Onboarding">
          <ol className="flex items-center justify-between gap-2">
            {t.onboarding.steps.map((s, i) => {
              const isCurrent = i === step
              const isDone = i < step
              return (
                <li key={s.title} className="flex items-center gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                        isCurrent
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : isDone
                          ? "bg-success text-success-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isDone ? <Check className="size-4" /> : i + 1}
                    </span>
                    <div className="hidden text-left sm:block">
                      <p
                        className={cn(
                          "text-xs font-medium",
                          isCurrent ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {s.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{s.subtitle}</p>
                    </div>
                  </div>
                  {i < t.onboarding.steps.length - 1 && (
                    <span
                      className={cn(
                        "h-0.5 w-6 rounded-full sm:w-10",
                        i < step ? "bg-success" : "bg-border"
                      )}
                    />
                  )}
                </li>
              )
            })}
          </ol>
        </header>

        {rateLimitError && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3 text-amber-300">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Atenção ao limite de requisições:</p>
              <p>{rateLimitError.message}</p>
              {rateLimitError.retryAfterSeconds > 0 && (
                <p className="text-amber-200/80 font-medium">
                  Tente novamente após aproximadamente {Math.floor(rateLimitError.retryAfterSeconds / 60)} minutos e {rateLimitError.retryAfterSeconds % 60} segundos.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex-1">
          {step === 0 && (
            <StepUpload
              fullExtractedText={fullExtractedText}
              profileData={profileData}
              onAnalyze={handleAnalyzeFiles}
              isAnalyzing={isAnalyzing}
              onNext={() => setOnboardingStep(step + 1)}
            />
          )}
          {step === 1 && <StepGoals />}
          {step === 2 && <StepContest />}
        </div>
      </div>
    </div>
  )
}