"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight, Check, Search, Wallet, MapPin, Users, Filter, Sparkles, GraduationCap, Award, Globe, BookOpen, Loader2, Target, AlertCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import { CONTESTS, getLocalizedText } from "@/lib/curriculum"
import {
  useTranslation,
  formatSalary,
  getWorkModeLabel,
  isRemoteWorkMode,
} from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface RecommendationData {
  soft_skills_recomendadas?: { skill: string; porque: string }[]
  pos_graduacoes_e_mbas?: { curso: string; objetivo: string }[]
  mestrado_doutorado_pesquisa?: { titulacao: string; area_tese_sugerida: string; objetivo: string }[]
  certificacoes_estrategicas?: string[]
  plano_carreira_internacional?: string
}

export function StepGoals() {
  const { state, setOnboardingStep, selectContest, setProfileData } = useStore()
  const { t, lang } = useTranslation()

  const [minSalary, setMinSalary] = React.useState<number>(30000)
  const [remoteOnly, setRemoteOnly] = React.useState<boolean>(false)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  
  const [loadingRecs, setLoadingRecs] = React.useState(false)
  const [recommendations, setRecommendations] = React.useState<RecommendationData | null>(null)
  const [rateLimitError, setRateLimitError] = React.useState<{ message: string; retryAfterSeconds: number } | null>(null)

  const filteredContests = React.useMemo(() => {
    return CONTESTS.filter((c) => {
      if (c.salary < minSalary) return false
      if (remoteOnly && !isRemoteWorkMode(c.workMode)) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const title = getLocalizedText(c.title, lang).toLowerCase()
        const org = c.organization.toLowerCase()
        const summary = getLocalizedText(c.summary, lang).toLowerCase()
        const matchesTags = c.tags.some((tag) => tag.toLowerCase().includes(q))
        if (!title.includes(q) && !org.includes(q) && !summary.includes(q) && !matchesTags) {
          return false
        }
      }
      return true
    })
  }, [minSalary, remoteOnly, searchQuery, lang])

  const selectedId = state.selectedContestId || CONTESTS[0].id
  const selectedContestObj = CONTESTS.find(c => c.id === selectedId)

  const handleFetchRecommendations = async () => {
    setLoadingRecs(true)
    setRateLimitError(null)

    try {
      const savedData = localStorage.getItem("user_profile_analysis")
      let extractedText = ""
      let baseCandidate = state.profileData || {}

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          extractedText = parsed?.extractedText || (parsed?.profile ? JSON.stringify(parsed.profile) : "")
          if (parsed?.profile) baseCandidate = parsed.profile
        } catch (e) {
          console.error("Erro ao ler cache do localStorage:", e)
        }
      }

      // Fallback: busca do Zustand se não encontrou no localStorage
      if (!extractedText && state.profileData) {
        extractedText =
          typeof state.profileData === "string"
            ? state.profileData
            : JSON.stringify(state.profileData)
      }

      // Validação defensiva pré-requisito de payload
      if (!extractedText || extractedText.trim() === "") {
        setRateLimitError({
          message: "Nenhum histórico ou currículo foi localizado para análise. Por favor, volte ao Passo 1 e reenvie seus arquivos.",
          retryAfterSeconds: 0,
        })
        setLoadingRecs(false)
        return
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extractedText,
          targetContest: selectedContestObj ? getLocalizedText(selectedContestObj.title, lang) : "",
          action: "recommendations"
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Erro HTTP: ${res.status}`)
      }

      setRecommendations(data)

      const unifiedProfile = {
        ...(baseCandidate || {}),
        strategicPlan: {
          softSkills: (data.soft_skills_recomendadas || []).map((s: any) => ({
            title: s.skill,
            description: s.porque
          })),
          mbas: (data.pos_graduacoes_e_mbas || []).map((m: any) => ({
            title: m.curso,
            description: m.objetivo
          })),
          masters: data.mestrado_doutorado_pesquisa?.[0] ? {
            title: data.mestrado_doutorado_pesquisa[0].titulacao,
            thesisArea: data.mestrado_doutorado_pesquisa[0].area_tese_sugerida,
            description: data.mestrado_doutorado_pesquisa[0].objetivo
          } : null,
          certificacoes: (data.certificacoes_estrategicas || []).join(", "),
          internationalCareer: data.plano_carreira_internacional || ""
        }
      }

      setProfileData(unifiedProfile)
      localStorage.setItem("user_profile_analysis", JSON.stringify({
        profile: unifiedProfile,
        extractedText,
        recommendations: data,
        analyzedAt: new Date().toISOString()
      }))
    } catch (err: any) {
      console.error("Erro ao buscar recomendações:", err)
      const errorStr = err?.message || String(err)

      if (errorStr.includes("429") || errorStr.includes("Rate limit")) {
        const matchMinutes = errorStr.match(/try again in (\d+)m([\d.]+)s/)
        const matchSeconds = errorStr.match(/try again in ([\d.]+)s/)
        
        let totalSeconds = 600
        if (matchMinutes) {
          totalSeconds = Math.ceil(parseInt(matchMinutes[1], 10) * 60 + parseFloat(matchMinutes[2]))
        } else if (matchSeconds) {
          totalSeconds = Math.ceil(parseFloat(matchSeconds[1]))
        }

        setRateLimitError({
          message: "Limite de cota da IA atingido no momento.",
          retryAfterSeconds: totalSeconds
        })
      } else {
        setRateLimitError({
          message: errorStr || "Não foi possível gerar as recomendações no momento.",
          retryAfterSeconds: 0
        })
      }
    } finally {
      setLoadingRecs(false)
    }
  }

  const hasSoftSkills = (recommendations?.soft_skills_recomendadas?.length ?? 0) > 0
  const hasPosMba = (recommendations?.pos_graduacoes_e_mbas?.length ?? 0) > 0
  const hasAcademic = (recommendations?.mestrado_doutorado_pesquisa?.length ?? 0) > 0
  const hasCerts = (recommendations?.certificacoes_estrategicas?.length ?? 0) > 0
  const hasGlobal = Boolean(recommendations?.plano_carreira_internacional)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {t.goals.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t.goals.subtitle}
        </p>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Filter className="size-4 text-primary" />
              <span>{t.goals.criteria}</span>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.goals.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-border/40 text-sm">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="size-4 rounded border-border text-primary focus:ring-primary"
              />
              {t.goals.remoteOnly}
            </label>

            <div className="flex items-center gap-3">
              <span className="text-muted-foreground font-medium">{t.goals.minSalary}</span>
              <div className="flex items-center gap-1.5">
                {[30000, 33000, 35000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMinSalary(val)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors border",
                      minSalary === val
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-secondary"
                    )}
                  >
                    ≥ {formatSalary(val, lang)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {filteredContests.length}{" "}
          {filteredContests.length === 1 ? t.goals.contestFound : t.goals.contestsFound}
        </div>

        {filteredContests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t.goals.noResults}
          </div>
        ) : (
          filteredContests.map((contest) => {
            const isSelected = selectedId === contest.id
            const title = getLocalizedText(contest.title, lang)
            const summary = getLocalizedText(contest.summary, lang)
            return (
              <div
                key={contest.id}
                onClick={() => selectContest(contest.id)}
                className={cn(
                  "group relative flex flex-col gap-3 rounded-xl border p-5 cursor-pointer transition-all bg-card",
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 shadow-sm"
                    : "border-border hover:border-border/80 hover:shadow-xs"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">
                        {title}
                      </h3>
                      <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-foreground">
                        {t.common.board}: {contest.board}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mt-0.5">
                      {contest.organization}
                    </p>
                  </div>

                  <div className={cn(
                    "flex size-6 items-center justify-center rounded-full border transition-colors",
                    isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"
                  )}>
                    {isSelected && <Check className="size-3.5" />}
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {summary}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium pt-1 text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                    <Wallet className="size-4" />
                    {formatSalary(contest.salary, lang)}/{t.common.month}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {getWorkModeLabel(contest.workMode, t)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-4" />
                    {contest.vacancies}{" "}
                    {contest.vacancies === 1 ? t.common.vacancy : t.common.vacancies}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {rateLimitError && (
        <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 p-4 flex items-start gap-3 text-amber-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold">Aviso do Sistema:</p>
            <p>{rateLimitError.message}</p>
            {rateLimitError.retryAfterSeconds > 0 && (
              <p className="text-amber-200/90 font-medium">
                Tente novamente após aproximadamente {Math.floor(rateLimitError.retryAfterSeconds / 60)} minutos e {rateLimitError.retryAfterSeconds % 60} segundos.
              </p>
            )}
          </div>
        </div>
      )}

      {selectedId && (
        <div className="pt-2">
          {!recommendations ? (
            <button
              type="button"
              onClick={handleFetchRecommendations}
              disabled={loadingRecs}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 cursor-pointer"
            >
              {loadingRecs ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analisando compatibilidade com o cargo...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Como melhorar meu perfil profissional para este cargo
                </>
              )}
            </button>
          ) : (
            <div className="rounded-xl border border-purple-500/30 bg-slate-900/80 p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-100">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-lg border-b border-slate-800 pb-3">
                <Target className="w-5 h-5 text-purple-400" /> Plano Estratégico para o Cargo Alvo
              </div>

              {hasSoftSkills && (
                <div>
                  <h5 className="text-sm font-semibold text-purple-300 flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4" /> Soft Skills Recomendadas
                  </h5>
                  <div className="grid gap-3">
                    {recommendations.soft_skills_recomendadas?.map((item, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                        <span className="font-bold text-white text-sm">{item.skill}</span>
                        <p className="text-xs text-slate-300 mt-1">{item.porque}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasPosMba && (
                <div>
                  <h5 className="text-sm font-semibold text-indigo-300 flex items-center gap-2 mb-3">
                    <GraduationCap className="w-4 h-4" /> Pós-Graduações e MBAs
                  </h5>
                  <div className="grid gap-3">
                    {recommendations.pos_graduacoes_e_mbas?.map((item, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                        <span className="font-bold text-white text-sm">{item.curso}</span>
                        <p className="text-xs text-slate-300 mt-1">{item.objetivo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasAcademic && (
                <div>
                  <h5 className="text-sm font-semibold text-cyan-300 flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4" /> Mestrado, Doutorado e Pesquisa
                  </h5>
                  <div className="grid gap-3">
                    {recommendations.mestrado_doutorado_pesquisa?.map((item, i) => (
                      <div key={i} className="p-3 bg-slate-800/60 rounded-lg border border-cyan-500/20">
                        <span className="font-bold text-cyan-400 text-sm block">{item.titulacao}</span>
                        <p className="text-xs text-white font-medium mt-1">Área de Tese: {item.area_tese_sugerida}</p>
                        <p className="text-xs text-slate-300 mt-1">{item.objetivo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(hasCerts || hasGlobal) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {hasCerts && (
                    <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60">
                      <h5 className="text-xs font-bold text-amber-400 flex items-center gap-2 mb-2 uppercase">
                        <Award className="w-4 h-4" /> Certificações Estratégicas
                      </h5>
                      <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                        {recommendations.certificacoes_estrategicas?.map((cert, i) => (
                          <li key={i}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {hasGlobal && (
                    <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60">
                      <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-2 mb-2 uppercase">
                        <Globe className="w-4 h-4" /> Carreira Internacional
                      </h5>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {recommendations.plano_carreira_internacional}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={() => setOnboardingStep(0)}>
          <ArrowLeft className="size-4" />
          {t.common.back}
        </Button>
        <Button
          onClick={() => setOnboardingStep(2)}
          disabled={!selectedId}
          className="font-semibold"
        >
          {t.goals.viewDetails}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}