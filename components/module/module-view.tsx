"use client"

import * as React from "react"
import {
  ArrowLeft,
  Check,
  Lock,
  Trophy,
  Stethoscope,
  BookOpen,
  Dumbbell,
  ClipboardCheck,
  Lightbulb,
  AlertTriangle,
  Table as TableIcon,
  FileText,
  Sparkles,
} from "lucide-react"
import type { ModulePhase } from "@/lib/types"
import { useStore } from "@/lib/store"
import { getModule } from "@/lib/curriculum"
import { moduleIcon } from "@/lib/module-meta"
import { Quiz, type QuizResult } from "@/components/quiz"
import { ProfessorChat } from "@/components/module/professor-chat"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PHASES: { key: ModulePhase; label: string; icon: typeof BookOpen; blurb: string }[] = [
  { key: "diagnostic", label: "Diagnóstico", icon: Stethoscope, blurb: "Mapeie suas lacunas" },
  { key: "theory", label: "Caderno de Teoria", icon: BookOpen, blurb: "Estudo aprofundado" },
  { key: "drills", label: "Exercícios", icon: Dumbbell, blurb: "Fixação por repetição" },
  { key: "exam", label: "Prova do Módulo", icon: ClipboardCheck, blurb: "Comprove seu domínio" },
]

export function ModuleView() {
  const {
    state,
    setActiveView,
    recordDiagnostic,
    markTheoryRead,
    markDrillsPassed,
    recordExam,
    masterModule,
    addReviewItems,
  } = useStore()
  
  const module = getModule(state.activeModuleId)
  const [phase, setPhase] = React.useState<ModulePhase>("diagnostic")

  const progress = module ? state.moduleProgress[module.id] : undefined

  // Direciona para a primeira fase não concluída
  React.useEffect(() => {
    if (!progress) return
    if (!progress.diagnosticDone) setPhase("diagnostic")
    else if (!progress.theoryRead) setPhase("theory")
    else if (!progress.drillsPassed) setPhase("drills")
    else setPhase("exam")
  }, [state.activeModuleId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!module || !progress) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Módulo não encontrado.</p>
        <Button className="mt-4" onClick={() => setActiveView("dashboard")}>
          Voltar para o painel
        </Button>
      </div>
    )
  }

  const Icon = moduleIcon(module.id)

  const phaseUnlocked: Record<ModulePhase, boolean> = {
    diagnostic: true,
    theory: progress.diagnosticDone,
    drills: progress.theoryRead,
    exam: progress.drillsPassed,
  }
  const phaseDone: Record<ModulePhase, boolean> = {
    diagnostic: progress.diagnosticDone,
    theory: progress.theoryRead,
    drills: progress.drillsPassed,
    exam: progress.mastered,
  }

  function queueWrong(result: QuizResult) {
    addReviewItems(
      result.wrongQuestions.map((q) => ({
        questionId: q.id,
        moduleId: module!.id,
        topic: q.topic,
        prompt: q.prompt,
        addedAt: Date.now(),
      }))
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-8">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setActiveView("dashboard")}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Voltar para a Trilha
        </button>
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Icon className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {module.code}
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-foreground text-balance sm:text-2xl">
              {module.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              {module.description}
            </p>
          </div>
          {progress.mastered && (
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 sm:inline-flex">
              <Trophy className="size-4" /> Dominado
            </span>
          )}
        </div>
      </div>

      {/* Stepper das Fases */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PHASES.map((p, i) => {
          const unlocked = phaseUnlocked[p.key]
          const done = phaseDone[p.key]
          const active = phase === p.key
          const PhaseIcon = p.icon
          return (
            <button
              key={p.key}
              type="button"
              disabled={!unlocked}
              onClick={() => setPhase(p.key)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors cursor-pointer disabled:cursor-not-allowed",
                active
                  ? "border-primary bg-primary/10"
                  : unlocked
                  ? "border-border bg-card hover:border-primary/40"
                  : "border-border/60 bg-card/40 opacity-60"
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  done
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : active
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {done ? (
                  <Check className="size-4" />
                ) : !unlocked ? (
                  <Lock className="size-3.5" />
                ) : (
                  <PhaseIcon className="size-4" />
                )}
              </span>
              <div className="min-w-0">
                <p
                  className={cn(
                    "truncate text-sm font-medium",
                    active || unlocked ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {i + 1}. {p.label}
                </p>
                <p className="truncate text-xs text-muted-foreground">{p.blurb}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Conteúdo da Fase */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        {phase === "diagnostic" && (
          <DiagnosticPhase
            module={module}
            done={progress.diagnosticDone}
            score={progress.diagnosticScore}
            onComplete={(r) => {
              recordDiagnostic(module.id, r.score)
              queueWrong(r)
              setPhase("theory")
            }}
          />
        )}

        {phase === "theory" && (
          <TheoryPhase
            module={module}
            done={progress.theoryRead}
            onDone={() => {
              markTheoryRead(module.id)
              setPhase("drills")
            }}
          />
        )}

        {phase === "drills" && (
          <DrillsPhase
            module={module}
            done={progress.drillsPassed}
            onComplete={() => {
              markDrillsPassed(module.id)
              setPhase("exam")
            }}
          />
        )}

        {phase === "exam" && (
          <ExamPhase
            module={module}
            progress={progress}
            onComplete={(r) => {
              recordExam(module.id, r.score)
              queueWrong(r)
              if (r.score >= 80) masterModule(module.id)
            }}
            onBackToDashboard={() => setActiveView("dashboard")}
          />
        )}
      </div>
    </div>
  )
}

/* ---------- Fase 1: Diagnóstico ---------- */
function DiagnosticPhase({
  module,
  done,
  score,
  onComplete,
}: {
  module: ReturnType<typeof getModule> & {}
  done: boolean
  score: number | null
  onComplete: (r: QuizResult) => void
}) {
  const [started, setStarted] = React.useState(false)

  if (done && !started) {
    return (
      <PhaseIntro
        title="Diagnóstico Concluído"
        body={`Você pontuou ${score}% no teste inicial. Mapeamos suas principais dificuldades e elas já foram direcionadas para a sua fila de revisão espaçada. Você pode refazer o teste ou avançar para o Caderno de Teoria.`}
        primaryLabel="Refazer Diagnóstico"
        onPrimary={() => setStarted(true)}
      />
    )
  }

  if (!started) {
    return (
      <PhaseIntro
        title="Avaliação Diagnóstica Inicial"
        body="Antes de iniciar os estudos teóricos, vamos identificar seu nível atual neste assunto. Responda com sinceridade — os erros cometidos aqui serão adicionados automaticamente à sua fila de revisão espaçada para serem trabalhados."
        primaryLabel="Iniciar Diagnóstico"
        onPrimary={() => setStarted(true)}
      />
    )
  }

  return (
    <Quiz
      questions={module.diagnostic}
      mode="linear"
      reveal="deferred"
      submitLabel="Ver Minhas Lacunas"
      onComplete={onComplete}
    />
  )
}

/* ---------- Fase 2: Caderno de Teoria Ampliado + Chat com Professor ---------- */
function TheoryPhase({
  module,
  done,
  onDone,
}: {
  module: ReturnType<typeof getModule> & {}
  done: boolean
  onDone: () => void
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* Caderno de Estudo Estruturado */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Caderno de Estudo Estruturado
            </h2>
          </div>
          {done && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="size-3.5" /> Estudo Concluído
            </span>
          )}
        </div>

        {/* Seções de Conteúdo Estruturado */}
        <div className="flex flex-col gap-6">
          {module.theory.map((section, idx) => (
            <article
              key={section.heading}
              className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col gap-4"
            >
              {/* Título da Subseção */}
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {idx + 1}
                </span>
                <h3 className="text-base font-bold text-foreground">
                  {section.heading}
                </h3>
              </div>

              {/* Explicação Principal */}
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                {section.body}
              </p>

              {/* Tabela Comparativa / Resumo Conceitual */}
              <div className="rounded-xl border border-border bg-background/60 p-3.5">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <TableIcon className="size-4 text-primary" />
                  Resumo de Conceitos & Diretrizes Chave
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="pb-2 font-semibold">Tópico / Pilar</th>
                        <th className="pb-2 font-semibold">Aplicação Prática</th>
                        <th className="pb-2 font-semibold">Regra Geral</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-foreground">
                      <tr>
                        <td className="py-2 font-medium">{section.heading}</td>
                        <td className="py-2 text-muted-foreground">Provas do Setor Público</td>
                        <td className="py-2 font-medium text-primary">Exigência Literal / Fundamentada</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Pontos de Atenção</td>
                        <td className="py-2 text-muted-foreground">Interpretação e Casos Práticos</td>
                        <td className="py-2 text-muted-foreground">Evitar pegadinhas de doutrina</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Exemplo Prático de Aplicação em Concurso */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Sparkles className="size-4" />
                  Exemplo Prático & Aplicação em Questões
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <strong>Caso de Prova:</strong> Em questões recentes das bancas como Cebraspe e FGV, o conceito de{" "}
                  <span className="font-semibold text-foreground">{section.heading}</span> é cobrado exigindo a diferenciação direta entre a regra geral e exceções legais. Fique atento a palavras como &quot;exclusivamente&quot; ou &quot;sempre&quot;.
                </p>
              </div>

              {/* Alerta de Pegadinha da Banca */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="size-4" />
                  Atenção: Pegadinha Frequente da Banca
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  As bancas costumam inverter os conceitos desta subseção com termos correlatos para induzir ao erro. Revise as palavras-chave destacadas no texto antes de avançar.
                </p>
              </div>
            </article>
          ))}
        </div>

        <Button onClick={onDone} className="w-full sm:w-fit font-semibold py-5">
          Concluí o estudo deste módulo — Ir para os Exercícios
        </Button>
      </div>

      {/* Chat do Professor Adaptativo */}
      <div className="h-[580px] lg:sticky lg:top-6">
        <ProfessorChat module={module} />
      </div>
    </div>
  )
}

/* ---------- Fase 3: Exercícios de Fixação ---------- */
function DrillsPhase({
  module,
  done,
  onComplete,
}: {
  module: ReturnType<typeof getModule> & {}
  done: boolean
  onComplete: () => void
}) {
  const [started, setStarted] = React.useState(false)

  if (!started) {
    return (
      <PhaseIntro
        title="Exercícios de Fixação"
        body={
          done
            ? "Você já concluiu estes exercícios. Refaça-os a qualquer momento para manter seu conhecimento afiado — cada questão deve ser respondida corretamente para finalizar."
            : "Responda a cada questão. Qualquer resposta incorreta será reciclada de volta para a fila até que você responda todas corretamente. Isso constrói retenção de longo prazo."
        }
        primaryLabel={done ? "Refazer Exercícios" : "Iniciar Exercícios"}
        onPrimary={() => setStarted(true)}
      />
    )
  }

  return (
    <Quiz
      questions={module.drills}
      mode="drill"
      reveal="immediate"
      submitLabel="Concluir Exercícios"
      onComplete={() => onComplete()}
    />
  )
}

/* ---------- Fase 4: Prova do Módulo ---------- */
function ExamPhase({
  module,
  progress,
  onComplete,
  onBackToDashboard,
}: {
  module: ReturnType<typeof getModule> & {}
  progress: { examScore: number | null; mastered: boolean; attempts: number }
  onComplete: (r: QuizResult) => void
  onBackToDashboard: () => void
}) {
  const [started, setStarted] = React.useState(false)
  const [lastResult, setLastResult] = React.useState<QuizResult | null>(null)

  if (started) {
    return (
      <Quiz
        questions={module.exam}
        mode="linear"
        reveal="deferred"
        submitLabel="Finalizar e Enviar Prova"
        onComplete={(r) => {
          setLastResult(r)
          setStarted(false)
          onComplete(r)
        }}
      />
    )
  }

  const passed = progress.mastered || (lastResult?.score ?? 0) >= 80

  if (lastResult) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span
          className={cn(
            "flex size-16 items-center justify-center rounded-full",
            passed ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/15 text-amber-600"
          )}
        >
          {passed ? <Trophy className="size-8" /> : <ClipboardCheck className="size-8" />}
        </span>
        <div>
          <p className="text-2xl font-bold text-foreground">{lastResult.score}%</p>
          <p className="text-sm text-muted-foreground">
            {lastResult.correctCount} de {lastResult.total} questões corretas
          </p>
        </div>
        {passed ? (
          <>
            <p className="max-w-md text-sm text-muted-foreground text-pretty">
              Parabéns! Você alcançou o nível de domínio neste módulo. O próximo módulo na sua trilha de aprendizagem já está desbloqueado.
            </p>
            <div className="flex gap-2">
              <Button onClick={onBackToDashboard}>Voltar para a Trilha</Button>
            </div>
          </>
        ) : (
          <>
            <p className="max-w-md text-sm text-muted-foreground text-pretty">
              Você precisa de no mínimo 80% de aproveitamento para dominar este módulo. As questões incorretas foram enviadas para a sua fila de revisão — revise a teoria e tente novamente.
            </p>
            <Button onClick={() => setStarted(true)}>Refazer Prova</Button>
          </>
        )}
      </div>
    )
  }

  return (
    <PhaseIntro
      title={progress.mastered ? "Prova do Módulo (Dominado)" : "Prova de Avaliação do Módulo"}
      body={
        progress.mastered
          ? "Você já dominou este módulo. Você pode refazer a prova a qualquer momento para testar seus conhecimentos e fixar o conteúdo."
          : "Esta é a prova final do módulo. Obtenha 80% ou mais para atingir o nível de domínio e desbloquear o próximo módulo. Questões erradas alimentam sua fila de revisão."
      }
      primaryLabel={progress.mastered ? "Refazer Prova" : "Iniciar Prova Final"}
      onPrimary={() => setStarted(true)}
      footer={
        progress.attempts > 0 ? (
          <p className="text-xs text-muted-foreground">
            Melhor nota anterior: {progress.examScore}% · {progress.attempts}{" "}
            {progress.attempts === 1 ? "tentativa realizada" : "tentativas realizadas"}
          </p>
        ) : null
      }
    />
  )
}

/* ---------- Componente de Apresentação de Fase ---------- */
function PhaseIntro({
  title,
  body,
  primaryLabel,
  onPrimary,
  footer,
}: {
  title: string
  body: string
  primaryLabel: string
  onPrimary: () => void
  footer?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-start gap-4 py-4">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
        {body}
      </p>
      <Button onClick={onPrimary} className="font-semibold">
        {primaryLabel}
      </Button>
      {footer}
    </div>
  )
}