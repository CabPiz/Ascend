"use client"

import { useStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard/dashboard"
import { ModuleView } from "@/components/module/module-view"
import { SimulationCenter } from "@/components/simulation/simulation-center"
import { LanguageSelector } from "@/components/language-selector"
import { Brand } from "@/components/brand"
import { ProfileView } from "@/components/profile/profile-view"

export function AppShell() {
  const { state, hydrated } = useStore()
  const { t } = useTranslation()

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="size-2.5 animate-pulse rounded-full bg-primary" />
          {t.common.loading}
        </div>
      </div>
    )
  }

  if (!state.onboardingComplete) {
    return <OnboardingWizard />
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-background/95 backdrop-blur-sm sticky top-0 z-20">
          <div className="md:hidden">
            <Brand />
          </div>
          <div className="hidden md:block text-sm font-medium text-muted-foreground">
            {t.appShell.panelTitle}
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <LanguageSelector />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden p-6">
          {state.activeView === "dashboard" && <Dashboard />}
          {state.activeView === "module" && <ModuleView />}
          {state.activeView === "simulation" && <SimulationCenter />}
          {state.activeView === "profile" && <ProfileView />}
        </main>
      </div>
    </div>
  )
}