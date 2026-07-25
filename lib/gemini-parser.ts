export interface ParsedProfile {
  nome: string
  resumo_executivo: string
  competencias: string[]
  senioridade: string
}

/**
 * Extrai todo o texto contido em um arquivo PDF ou arquivo de texto no browser.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  // Se for arquivo de texto simples (.txt, .md, .csv, etc)
  if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
    return await file.text()
  }

  // Se for PDF
  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    const pdfjsLib = await import("pdfjs-dist")
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ""

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(" ")
      fullText += pageText + "\n"
    }

    return fullText
  }

  // Fallback para outros tipos de arquivo de texto
  try {
    return await file.text()
  } catch {
    throw new Error(`Formato de arquivo não suportado: ${file.name}`)
  }
}

/**
 * Manter compatibilidade com chamadas individuais de PDF
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  return extractTextFromFile(file)
}

/**
 * Envia o texto extraído consolidado para a rota da API do Next.js processar com a IA (Groq/Gemini).
 */
export async function analyzeProfileWithGemini(extractedText: string): Promise<ParsedProfile> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      extractedText,
      action: "analyze" // Garante o cumprimento do contrato com route.ts
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Erro ao processar análise do perfil.")
  }

  return data as ParsedProfile
}