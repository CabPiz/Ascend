import { NextResponse } from "next/server"
import Groq from "groq-sdk"

export async function POST(request: Request) {
  try {
    const { extractedText, action } = await request.json()

    if (!extractedText) {
      return NextResponse.json({ error: "Texto não fornecido." }, { status: 400 })
    }

    // Proteção contra estouro de contexto e de limite de cota da API (Groq)
    const MAX_TEXT_LENGTH = 35000
    const sanitizedText =
      extractedText.length > MAX_TEXT_LENGTH
        ? extractedText.slice(0, MAX_TEXT_LENGTH) +
          "\n\n[AVISO SISTEMA: Texto truncado em 35.000 caracteres para preservação de limite de tokens da API.]"
        : extractedText

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY não configurada no servidor." }, { status: 500 })
    }

    const groq = new Groq({ apiKey })

    // AÇÃO 1: Análise Consolidada do Perfil
    if (action === "analyze") {
      const prompt = `
        Você é um especialista em recrutamento executivo de TI.
        Analise o texto consolidado de TODOS os documentos do candidato (currículo, histórico escolar, certificações):
        
        ${sanitizedText}

        Retorne estritamente um JSON com a consolidação UNIFICADA de todo o histórico:
        {
          "nome": "Nome completo do candidato",
          "resumo_executivo": "Resumo unificado e sênior (4 a 6 frases) unindo a experiência prática do currículo com a bagagem do histórico acadêmico.",
          "competencias": ["Array único de até 12 principais Hard Skills sem repetições"],
          "senioridade": "Júnior | Pleno | Sênior | Especialista"
        }
      `

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        temperature: 0.2,
      })

      return NextResponse.json(JSON.parse(completion.choices[0]?.message?.content || "{}"))
    }

    // AÇÃO 2: Recomendações Estratégicas de Aprimoramento (Focado Apenas nas Lacunas)
    if (action === "recommendations") {
      const prompt = `
        Você é um mentor executivo de carreiras de TI e concursos de alto nível.
        Examine o histórico e currículo do candidato abaixo:
        
        ${sanitizedText}

        DIRETRIZES DE ANÁLISE:
        1. Avalie o que o candidato JÁ POSSUI no currículo/histórico (ex: se já tem pós-graduação, MBA, certificações, mestrado ou soft skills demonstradas).
        2. Retorne SUGESTÕES APENAS PARA O QUE FALTAR ou puder levá-lo ao próximo nível salarial/executivo ($100k+/ano ou cargos de liderança/P&D/concursos de topo).
        3. Se o candidato já possui uma categoria bem consolidada, retorne um array VAZIO [] para essa categoria, para que o sistema não exiba blocos desnecessários.
        4. Considere oportunidades de pós-graduação lato sensu, MBA, Stricto Sensu (Mestrado, Doutorado, Pós-Doutorado) e Linhas de Pesquisa/Teses/Artigos se o perfil for adequado para P&D ou alta titulação.

        Retorne estritamente um JSON no seguinte formato:
        {
          "soft_skills_recomendadas": [
            { "skill": "Nome da Soft Skill", "porque": "Motivo estratégico de como essa habilidade complementará as hard skills existentes" }
          ],
          "pos_graduacoes_e_mbas": [
            { "curso": "Nome da Pós ou MBA recomendados", "objetivo": "Impacto na carreira/salário" }
          ],
          "mestrado_doutorado_pesquisa": [
            { "titulacao": "Mestrado | Doutorado | Pós-Doutorado | Linha de Pesquisa", "area_tese_sugerida": "Tema de tese/pesquisa/artigo sugerido para o perfil", "objetivo": "Benefício executivo, docente ou para concursos públicos de elite" }
          ],
          "certificacoes_estrategicas": [
            "Certificação 1 (apenas se ele ainda não tiver)"
          ],
          "plano_carreira_internacional": "Estratégia para alavancar este perfil para vagas remotas internacionais/dólar (ou string vazia se não aplicável)"
        }
      `

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        temperature: 0.3,
      })

      return NextResponse.json(JSON.parse(completion.choices[0]?.message?.content || "{}"))
    }

    return NextResponse.json({ error: "Ação inválida." }, { status: 400 })
  } catch (error: any) {
    console.error("Erro no processamento da API de análise:", error)

    // Tratamento de Erro 429 (Rate Limit / Excesso de Cota)
    const isRateLimit =
      error?.status === 429 ||
      error?.message?.includes("429") ||
      error?.message?.includes("rate_limit") ||
      error?.message?.includes("quota")

    const statusCode = isRateLimit ? 429 : 500
    const errorMessage = isRateLimit
      ? "O limite de cota de requisições do provedor de IA foi atingido temporariamente. Por favor, aguarde de 1 a 2 minutos e tente novamente."
      : error?.message || "Ocorreu um erro interno ao processar os documentos."

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}