"use client"

import * as React from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  User, 
  Sparkles, 
  Target, 
  GraduationCap, 
  Award, 
  Globe, 
  BookOpen, 
  Briefcase,
  AlertCircle
} from "lucide-react"

export function ProfileView() {
  const { state } = useStore()
  
  // Leitura estrita e dinâmica do estado global da memória (sem fallbacks estáticos)
  const profile = state.profileData

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
          <AlertCircle className="size-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">Nenhum perfil carregado</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Parece que os dados do currículo ainda não foram processados ou salvos na sessão. Conclua o processo de onboarding para visualizar as informações dinâmicas do candidato.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Perfil do Candidato & Plano Estratégico
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Consolidação dinâmica extraída do currículo e do plano de aprimoramento do candidato.
        </p>
      </div>

      {/* SEÇÃO 1: RESUMO PROFISSIONAL E HARD SKILLS DINÂMICAS */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="flex flex-col gap-6 p-6">
          {/* Cabeçalho do Candidato */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm">
              {profile.name ? profile.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() : "US"}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-foreground">{profile.name || "Candidato"}</h2>
                {profile.level && (
                  <span className="rounded-md bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {profile.level}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Perfil Profissional Analisado por Inteligência Artificial</p>
            </div>
          </div>

          {/* Resumo Consolidado */}
          {profile.summary && (
            <div className="rounded-xl border border-border bg-secondary/40 p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Sparkles className="size-4" />
                <span>Resumo Profissional Consolidado</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {profile.summary}
              </p>
            </div>
          )}

          {/* Hard Skills */}
          {profile.hardSkills && profile.hardSkills.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="size-3.5" />
                Hard Skills Consolidadas (Currículo + Formação)
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.hardSkills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground border border-border/60 shadow-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEÇÃO 2: PLANO ESTRATÉGICO DINÂMICO PARA O CARGO ALVO */}
      {profile.strategicPlan && (
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center gap-2 text-foreground font-bold text-lg">
            <Target className="size-5 text-purple-500" />
            <span>Plano Estratégico para o Cargo Alvo</span>
          </div>

          {/* Soft Skills Recomendadas */}
          {profile.strategicPlan.softSkills && profile.strategicPlan.softSkills.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                  <Sparkles className="size-4" />
                  Soft Skills Recomendadas
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                {profile.strategicPlan.softSkills.map((item: any, idx: number) => (
                  <div key={idx} className="rounded-lg bg-secondary/50 p-3.5 border border-border/50">
                    <p className="font-bold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Pós-Graduações e MBAs */}
          {profile.strategicPlan.mbas && profile.strategicPlan.mbas.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                  <GraduationCap className="size-4" />
                  Pós-Graduações e MBAs
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                {profile.strategicPlan.mbas.map((item: any, idx: number) => (
                  <div key={idx} className="rounded-lg bg-secondary/50 p-3.5 border border-border/50">
                    <p className="font-bold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Mestrado, Doutorado e Pesquisa */}
          {profile.strategicPlan.masters && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                  <BookOpen className="size-4" />
                  Mestrado, Doutorado e Pesquisa
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                  <p className="font-bold text-primary">{profile.strategicPlan.masters.title}</p>
                  {profile.strategicPlan.masters.thesisArea && (
                    <p className="text-xs font-medium text-foreground mt-0.5">
                      Área de Tese: {profile.strategicPlan.masters.thesisArea}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {profile.strategicPlan.masters.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certificações e Carreira Internacional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.strategicPlan.certifications && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <Award className="size-4" />
                    Certificações Estratégicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="text-xs leading-relaxed">{profile.strategicPlan.certifications}</p>
                </CardContent>
              </Card>
            )}

            {profile.strategicPlan.internationalCareer && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Globe className="size-4" />
                    Carreira Internacional
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  {profile.strategicPlan.internationalCareer}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}