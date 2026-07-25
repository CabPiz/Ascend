# Especificação de Requisitos de Software (SRS) — Parte 1
## Plataforma AscendIt (Módulo de Onboarding e Análise de IA)

## 1. Visão Geral e Escopo
O **AscendIt** é uma plataforma de estudos de alto desempenho voltada para concursos públicos de TI de alto nível (bancas Cebraspe, FGV, FCC). A Parte 1 deste SRS consolida os requisitos funcionais e não funcionais do **Módulo de Onboarding e Análise de IA**, responsável por processar os documentos iniciais do candidato (currículos, histórico acadêmico e profissional) e estruturar seu plano de carreira e diretrizes iniciais de estudo.

---

## 2. Requisitos Funcionais (RF)

- **RF01 - Upload de Documentos do Candidato (`step-upload.tsx`)**:
  - O sistema deve fornecer uma interface visual limpa e intuitiva para que o usuário faça o upload dos seus arquivos de currículo ou histórico profissional.
  - O componente deve validar o formato e extrair o texto bruto (`extractedText`) para envio via API.

- **RF02 - Processamento de IA via Rota de Análise (`/api/analyze`)**:
  - O sistema deve enviar o texto extraído para o endpoint de backend utilizando o Groq SDK (`llama-3.3-70b-versatile`).
  - O payload da requisição deve conter obrigatoriamente o parâmetro `extractedText`.

- **RF03 - Resposta Estruturada em JSON**:
  - A API de IA deve retornar um objeto estritamente em formato JSON (`response_format: { type: "json_object" }`) contendo:
    - Nome completo do candidato.
    - Resumo executivo sênior unificado.
    - Hard skills consolidadas.
    - Senioridade estimada.
    - Recomendações estratégicas (soft skills, pós-graduações, certificações e carreira internacional).

---

## 3. Requisitos Não Funcionais (RNF)

- **RNF01 - Tratamento de Erros e Resiliência**:
  - Caso o parâmetro `extractedText` esteja ausente ou vazio, a API deve retornar o status HTTP **400 (Bad Request)**.
  - Caso a chave de ambiente `GROQ_API_KEY` não esteja configurada no servidor, a API deve retornar o status HTTP **500 (Internal Server Error)**.

- **RNF02 - Padronização de Documentação**:
  - Toda a documentação técnica gerada para o projeto AscendIt deve ser disponibilizada diretamente em arquivos Markdown (`.md`) para download, assegurando rastreabilidade e governança sênior.

---

## 4. Regras de Negócio (RN)

- **RN01 - Isolamento de Contexto**:
  - O plano estratégico de aprimoramento profissional gerado pela IA deve ser apresentado de forma isolada na interface de onboarding, garantindo uma experiência de usuário fluida e sem sobrecarga cognitiva.