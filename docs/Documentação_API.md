# Documentação Oficial da API - AscendIT

## 1. Visão Geral do Endpoint
- **Rota:** `/api/analyze`
- **Método:** `POST`
- **Objetivo:** Processar o texto extraído dos documentos do candidato (currículo, histórico acadêmico e profissional) para realizar análises executivas de perfil, estruturar competências, sugerir pós-graduações, certificações e planos de carreira internacional.
- **Provedor de IA Subjacente:** Groq SDK (`groq-sdk`) utilizando o modelo `llama-3.3-70b-versatile` com resposta estritamente em formato JSON (`response_format: { type: "json_object" }`).

## 2. Contrato de Requisição (Request Payload)
O corpo da requisição (`JSON`) deve conter obrigatoriamente:
- `extractedText` (string, obrigatório): Conteúdo bruto extraído na esteira de onboarding (`step-upload.tsx`).

## 3. Validações e Tratamento de Erros
Para garantir a estabilidade da esteira de desenvolvimento e robustez em produção, o endpoint implementa os seguintes códigos de status HTTP:
- **Erro 400 (Bad Request):** Retornado automaticamente caso o parâmetro obrigatório `extractedText` esteja ausente, nulo ou vazio no payload JSON recebido.
- **Erro 500 (Internal Server Error):** Retornado caso a chave de API `GROQ_API_KEY` não esteja devidamente configurada no ambiente de execução do servidor.

## 4. Contrato de Resposta (Response Payload - Sucesso)
Em caso de sucesso (`Status 200 OK`), a API retorna um objeto JSON estruturado unificando o histórico profissional e acadêmico do candidato, abrangendo:
- Nome completo do candidato.
- Resumo executivo sênior unificado.
- Hard skills consolidadas.
- Senioridade estimada.
- Recomendações estratégicas (soft skills, pós-graduações, mestrado/doutorado, certificações e carreira internacional).