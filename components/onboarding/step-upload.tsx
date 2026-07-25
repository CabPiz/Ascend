"use client"

import { useState, DragEvent, useEffect } from "react"
import { Sparkles, GraduationCap, Target, Award, Globe, BookOpen, Loader2, Upload, FileText, X, ArrowRight, Trash2 } from "lucide-react"
import { useTranslation, interpolate } from "@/lib/i18n"
import { useStore } from "@/lib/store"

interface RecommendationData {
  soft_skills_recomendadas?: { skill: string; porque: string }[]
  pos_graduacoes_e_mbas?: { curso: string; objetivo: string }[]
  mestrado_doutorado_pesquisa?: { titulacao: string; area_tese_sugerida: string; objetivo: string }[]
  certificacoes_estrategicas?: string[]
  plano_carreira_internacional?: string
}

export function StepUpload({
  fullExtractedText = "",
  profileData: initialProfileData,
  onAnalyze,
  isAnalyzing = false,
  onNext
}: {
  fullExtractedText?: string
  profileData?: any
  onAnalyze?: (files: File[]) => void
  isAnalyzing?: boolean
  onNext?: () => void
}) {
  const { t } = useTranslation()
  const { setProfileData } = useStore()
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [profileData, setLocalProfileData] = useState<any>(initialProfileData || null)

  // Recupera dados salvos no localStorage ao montar o componente (Persistência de Sessão)
  useEffect(() => {
    try {
      const savedCache = localStorage.getItem("user_profile_analysis")
      if (savedCache && !initialProfileData) {
        const parsed = JSON.parse(savedCache)
        if (parsed?.profile) {
          setLocalProfileData(parsed.profile)
          setProfileData(parsed.profile)
        }
      } else if (initialProfileData) {
        setLocalProfileData(initialProfileData)
        setProfileData(initialProfileData)
      }
    } catch (e) {
      console.error("Erro ao carregar cache do perfil:", e)
    }
  }, [initialProfileData, setProfileData])

  useEffect(() => {
    if (onAnalyze && files.length > 0) {
      onAnalyze(files)
    }
  }, [files, onAnalyze])

  const processAndAnalyzeFiles = (newFiles: File[]) => {
    setFiles((prevFiles) => {
      const existingNames = new Set(prevFiles.map(f => f.name))
      const filteredNew = newFiles.filter(f => !existingNames.has(f.name))
      return [...prevFiles, ...filteredNew]
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processAndAnalyzeFiles(Array.from(e.target.files))
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAndAnalyzeFiles(Array.from(e.dataTransfer.files))
      e.dataTransfer.clearData()
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Função para limpar dados e reiniciar o estado do passo 1
  const handleClearData = () => {
    setFiles([])
    setLocalProfileData(null)
    setProfileData(null)
    try {
      localStorage.removeItem("user_profile_analysis")
    } catch (e) {
      console.error("Erro ao limpar localStorage:", e)
    }
  }

  const initials = profileData?.nome
    ? profileData.nome.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "CP"

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Botão de Limpar Dados / Resetar Sessão */}
      {(profileData || files.length > 0) && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClearData}
            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar Dados e Recomeçar
          </button>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? "border-blue-400 bg-blue-500/10 scale-[1.01]"
            : "border-slate-700 bg-slate-900/40 hover:border-slate-500"
        }`}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf,.docx,.txt,.md"
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className={`p-3 rounded-full transition-colors ${isDragging ? "bg-blue-500/30 text-blue-300" : "bg-blue-500/10 text-blue-400"}`}>
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-white">
              {isDragging ? t.upload.dropHere : t.upload.dragDrop}
            </p>
            <p className="text-xs text-slate-400 mt-1">{t.upload.fileTypes}</p>
          </div>
          <span className="mt-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium hover:bg-slate-700 transition-colors">
            {t.upload.addFiles}
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {interpolate(t.upload.attachedDocs, { count: files.length })}
          </h4>
          <div className="flex flex-wrap gap-2">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-200">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate max-w-[200px]">{file.name}</span>
                <button type="button" onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-400 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="p-6 rounded-xl border border-blue-500/30 bg-slate-900/80 flex items-center justify-center gap-3 text-blue-400 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">{t.upload.analyzing}</span>
        </div>
      )}

      {profileData && !isAnalyzing && (
        <div className="rounded-xl border border-emerald-500/30 bg-slate-900/60 p-6 shadow-xl space-y-6 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{profileData?.nome || t.upload.candidate}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium">
                {profileData?.senioridade || t.upload.mappedProfile}
              </span>
            </div>
          </div>

          {profileData?.resumo_executivo && (
            <div className="rounded-lg bg-slate-800/80 p-4 border border-slate-700/50">
              <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" /> {t.upload.executiveSummary}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">{profileData.resumo_executivo}</p>
            </div>
          )}

          {profileData?.competencias && profileData.competencias.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {t.upload.hardSkills}
              </h4>
              <div className="flex flex-wrap gap-2">
                {profileData.competencias.map((skill: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg bg-slate-800/40 p-4 border border-slate-700/40 text-center">
            <p className="text-xs text-slate-300 font-medium">
              Vamos avaliar como melhorar seu perfil profissional após você escolher o cargo pretendido na próxima etapa.
            </p>
          </div>
        </div>
      )}

      {/* Bloco de recomendações estratégicas removido com sucesso da Tela 1 conforme diretriz */}

      {profileData && !isAnalyzing && onNext && (
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={onNext}
            className="py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            {t.upload.nextStep} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}