# Especificação de Requisitos de Software (SRS) — Parte 3

**Plataforma AscendIt** (Módulo de Ecossistema de Questões, Submissão de Simulados e Motor de Repetição Espaçada)

## 1. Visão Geral e Escopo da Parte 3

A Parte 3 deste SRS especifica os requisitos funcionais, não funcionais e regras de negócio para o motor de resolução de questões, submissão de simulados e gestão da fila de repetição espaçada (*Spaced Repetition* / *review-queue.tsx*). O objetivo é garantir que o estudante de TI para concursos públicos de alto nível (Cebraspe, FGV, FCC) consolide o aprendizado através de ciclos ativos de reforço pedagógico baseados em erros anteriores.

## 2. Requisitos Funcionais (RF)

- **RF07 - Resolução e Submissão de Questões (`simulation-center.tsx`)**:
  - O sistema deve prover uma interface limpa e responsiva para a exibição de enunciados de múltipla escolha ou assertivas de Certo/Errado (padrão da banca que o candidato escolheu focar para concursar).
  - O candidato deve conseguir selecionar sua resposta e submetê-la para validação imediata pelo sistema, registrando o tempo de resolução e o gabarito oficial.

- **RF08 - Gestão da Fila de Revisão Espaçada (`review-queue.tsx`)**:
  - Sempre que uma questão for respondida incorretamente ou marcada manualmente para revisão, o sistema deve inseri-la automaticamente na fila de repetição espaçada do usuário.
  - A interface deve exibir quais tópicos possuem pendências de revisão com base na criticidade e na taxa de erro histórica do candidato.

- **RF09 - Feedback Analítico Pós-Simulado**:
  - Após a submissão de um bloco de simulado, o sistema deve calcular instantaneamente a taxa de acertos, o tempo médio por questão e categorizar as lacunas por matéria (ex: Governança de TI - COBIT/ITIL, Engenharia de Software, Bancos de Dados).

## 3. Requisitos Não Funcionais (RNF)

- **RNF05 - Latência de Resposta na Submissão**:
  - A submissão de respostas e a computação do gabarito no banco de dados devem ocorrer em um tempo inferior a 500ms para garantir fluidez na experiência do usuário.
- **RNF06 - Persistência Segura de Progresso**:
  - O histórico de submissões e o estado da fila de revisão espaçada devem ser persistidos de forma segura, garantindo que o candidato não perca seu progresso em caso de interrupção da sessão.

## 4. Regras de Negócio (RN)

- **RN05 - Ciclo de Repeteco Pedagógico (*Spaced Repetition*)**:
  - Uma questão errada na central de simulados só pode ser dada como "superada" na fila de revisão após o candidato acertá-la em dois ciclos consecutivos de reforço em datas distintas.
- **RN06 - Ponderação por Banca Examinadora**:
  - O motor de simulados deve aplicar pesos estatísticos diferenciados caso o simulado seja configurado para focar em bancas específicas (ex: penalidade de erro em provas estilo Cebraspe onde uma errada anula uma certa, caso aplicável ao perfil do concurso selecionado).