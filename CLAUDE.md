# CLAUDE.md — Ascend

Repositório: `CabPiz/Ascend` | Owner: `CabPiz` | Project Board: nº **1**
**Stack:** Next.js 15 · TypeScript · Tailwind CSS · Supabase · Playwright

---

## ⚙️ Config do Projeto

| Campo | Valor |
|---|---|
| `[BOARD_NUMBER]` | `1` |
| `[MILESTONES_API]` | `repos/CabPiz/Ascend/milestones` |
| `[DIARIO_PREFIX]` | `diario(ascend)` |
| `[PROJETO]` | `ascend` |
| Campo obrigatório no diário | `* **Projeto:** \`Ascend\`` |

### Milestones — Issues Finais
*(ainda não definidas — verificar ao iniciar cada milestone)*

### Board
```bash
gh project item-add 1 --owner CabPiz --url [url]
gh api repos/CabPiz/Ascend/milestones --jq '.[].title'
```

---

## 📓 Diário de Aprendizado
Commitado **apenas** em `CabPiz/concentrador` (privado):
```bash
cd "C:/Users/Cesar/Documents/Desenvolvimento/projeto_concentrador/concentrador"
git pull origin main
# inserir entrada no topo de 1.diario_de_aprendizado.md
git add 1.diario_de_aprendizado.md
git commit -m "diario(ascend): [título curto da entrada]"
git push origin main
```
O arquivo `1.diario_de_aprendizado.md` neste projeto está no `.gitignore`.

## 📋 Business Plan
Localização: `CabPiz/concentrador` → `ascend/business_plan.md`
O arquivo `business_plan.md` está no `.gitignore`.

---

## 📖 Protocolo Universal

Na abertura de toda sessão (`issue #[número]`), ler na FASE 0:
```
C:/Users/Cesar/Documents/Desenvolvimento/projeto_concentrador/concentrador/CLAUDE.md
C:/Users/Cesar/Documents/Desenvolvimento/projeto_concentrador/concentrador/_protocol/FASES.md
C:/Users/Cesar/Documents/Desenvolvimento/projeto_concentrador/concentrador/_knowledge/BUILD_ERRORS.md
C:/Users/Cesar/Documents/Desenvolvimento/projeto_concentrador/concentrador/_knowledge/COVERAGE_GAPS.md
C:/Users/Cesar/Documents/Desenvolvimento/projeto_concentrador/concentrador/_knowledge/FEEDBACK_UNIVERSAL.md
```

Arquivos adicionais lidos sob demanda (ver tabela em `CLAUDE.md` do concentrador):
- `_protocol/SONAR.md` — antes da FASE 2
- `_protocol/DIARIO.md` — no encerramento
- `_protocol/MILESTONE.md` — ao fechar milestone
