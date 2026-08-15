# Ascend

> Do currículo ao salário máximo — trilhas de evolução personalizadas por IA.

**Ascend** é uma plataforma de evolução profissional que gera trilhas de aprendizado personalizadas com base em três entradas: quem você é hoje, para onde você quer ir e o que o mercado exige agora. Não é um curso — é um sistema de orientação contínua que se adapta conforme você avança.

O modelo central: **gratuito para quem está desempregado**. Quando o usuário é efetivado (verificado via Carteira de Trabalho digital do gov.br), converte automaticamente para o plano Pro.

🌐 [English](./README.en.md) · [Español](./README.es.md)

---

## O que faz

- Importa currículo (PDF) e extrai perfil por IA
- Cruza perfil real com vagas do mercado privado ou editais de concurso público
- Calcula gap de competências e gera trilha priorizada com recursos curados
- Cada fase tem tempo estimado e marcos mensuráveis (certificações, projetos)
- Recalibra a trilha conforme o usuário avança ou o mercado muda

---

## Modos de uso

| Modo | Público | Como funciona |
|---|---|---|
| Mercado Privado | Profissionais em recolocação ou upgrade salarial (CLT/PJ) | Trilha baseada em cargo-alvo + salário desejado |
| Concurso Público | Candidatos a cargos de TI em órgãos federais e estaduais | Trilha baseada em edital + banca + prazo |

---

## Status

| Milestone | Descrição | Status |
|---|---|---|
| M1 | Fundação (auth, banco, scaffold) | 🟡 Em progresso |
| M2 | Trilha Mercado Privado — MVP | ⬜ Pendente |
| M3 | Trilha Concurso Público | ⬜ Pendente |
| M4 | Verificação de efetivação + conversão Pro | ⬜ Pendente |
| M5 | Expansão (novos domínios, LATAM) | ⬜ Pendente |

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js (App Router) · TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase (PostgreSQL · Auth · Storage · RLS) |
| IA | Anthropic Claude API (análise de gap · geração de trilha) |
| CI/CD | Vercel · GitHub Actions |
| Qualidade | SonarCloud |

---

## Contato

Sugestões e parcerias via site oficial da Kairos Labs:
**[kairos-labs-lake.vercel.app/pt](https://kairos-labs-lake.vercel.app/pt)**

---

## Licença

**Todos os direitos reservados** — Cesar Antonio Brito Pizarro / Ascend

Veja [LICENSE](./LICENSE) · [LICENSE.en](./LICENSE.en) · [LICENSE.es](./LICENSE.es)
