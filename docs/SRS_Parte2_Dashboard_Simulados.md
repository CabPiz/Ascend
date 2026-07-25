# Especificação de Requisitos de Software (SRS) - Parte 2
## Projeto: Plataforma de Estudos para Concursos de TI (AscendIt)
## Módulo: Dashboard Executivo, Roadmap de Estudos e Central de Simulado

---

## 1. Escopo e Visão Geral da Parte 2
Este documento especifica os requisitos funcionais, não funcionais e regras de negócio para as telas de acompanhamento de desempenho, planejamento modular de matérias (Roadmap) e resolução de questões/simulados da plataforma AscendIt. O objetivo é fornecer ao estudante (bacharel em Sistemas de Informação focado em concursos públicos de alto nível) uma visão analítica do seu progresso, permitindo revisões espaçadas e mapeamento de lacunas de conhecimento.

---

## 2. Requisitos Funcionais (RF)

### RF04: Renderização do Dashboard Executivo (`dashboard.tsx`)
- **Descrição:** O sistema deve exibir um painel central consolidando as principais métricas de desempenho do candidato.
- **Parâmetros/Métricas Exibidas:**
  - Taxa geral de acertos por matéria e por banca examinadora (Cebraspe, FGV, FCC).
  - Quantidade total de questões resolvidas *versus* pendentes.
  - Módulos de estudo concluídos e status das revisões espaçadas (*Spaced Repetition*).

### RF05: Gestão do Roadmap de Estudos (`roadmap-module.tsx`)
- **Descrição:** O sistema deve apresentar a trilha de aprendizagem estruturada especificamente para o candidato passar no concurso pretendido (ex: Governança de TI - COBIT 2019 e ITIL 4, Engenharia de Software, Bancos de Dados, Direito Administrativo e Constitucional).
- **Regra de Comportamento:** O estudante pode visualizar o andamento de cada bloco e navegar para o conteúdo ou simulado correspondente.

### RF06: Central de Simulado e Fila de Revisão (`simulation-center.tsx` e `review-queue.tsx`)
- **Descrição:** O sistema deve gerenciar uma fila dinâmica de questões erradas ou marcadas para revisão, permitindo ciclos de reforço pedagógico até que o candidato atinja o gabarito nas provas.

---

## 3. Requisitos Não Funcionais (RNF)
- **RNF03:** O carregamento inicial do Dashboard Executivo (`dashboard.tsx`) deve ocorrer em menos de 1.5 segundos para garantir fluidez na navegação.
- **RNF04:** A responsabilidade visual das telas de dashboard e simulado deve ser totalmente compatível com dispositivos desktop e tablets através do uso de classes utilitárias do Tailwind CSS.

---

## 4. Regras de Negócio (RN)
- **RN03 (Repeteco Pedagógico):** Sempre que o candidato errar uma questão de simulado pertencente a um tópico específico (ex: Domínios EDM/APO do COBIT), o sistema deve automaticamente reencaminhar o item para a `review-queue.tsx` (Fila de Revisão Espaçada).
- **RN04 (Evolução Automática de Grade):** O progresso percentual exibido no roadmap deve ser recalculado dinamicamente com base na conclusão bem-sucedida dos testes e quizzes práticos associados a cada matéria.