import type { BoardProfile, Contest, Module, Language } from "./types"

/** Prazo de inscrição calculado de forma dinâmica a partir de "agora". */
function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(23, 59, 0, 0)
  return d.toISOString()
}

export const CONTESTS: Contest[] = [
  {
    id: "trf-auditor",
    title: {
      pt: "Analista de Auditoria de TI",
      en: "IT Audit Analyst",
      es: "Analista de Auditoría de TI",
    },
    organization: "Tribunal Regional Federal (TRF-3)",
    board: "Cebraspe",
    salary: 33689,
    workMode: "100% Remoto",
    vacancies: 18,
    registrationLink: "https://www.cebraspe.org.br/concursos",
    registrationDeadline: daysFromNow(12),
    summary: {
      pt: "Auditar e governar os sistemas de informação do tribunal, garantindo conformidade com COBIT, ITIL e regulamentações federais de segurança.",
      en: "Audit and govern the court's information systems, ensuring compliance with COBIT, ITIL and federal security regulations.",
      es: "Auditar y gobernar los sistemas de información del tribunal, garantizando el cumplimiento de COBIT, ITIL y regulaciones federales de seguridad.",
    },
    tags: ["Governança", "Auditoria", "Segurança", "COBIT"],
  },
  {
    id: "bcb-architect",
    title: {
      pt: "Arquiteto de Sistemas",
      en: "Systems Architect",
      es: "Arquitecto de Sistemas",
    },
    organization: "Banco Central do Brasil (BACEN)",
    board: "FGV",
    salary: 30765,
    workMode: "100% Remoto",
    vacancies: 12,
    registrationLink: "https://conhecimento.fgv.br/concursos",
    registrationDeadline: daysFromNow(21),
    summary: {
      pt: "Projetar plataformas financeiras resilientes de alta disponibilidade e liderar a governança de arquitetura para o sistema de pagamentos nacional.",
      en: "Design resilient, high-availability financial platforms and lead architectural governance for the national payment system.",
      es: "Diseñar plataformas financieras resilientes de alta disponibilidad y liderar la gobernanza de arquitectura para el sistema de pagos nacional.",
    },
    tags: ["Arquitetura", "Bancos de Dados", "Nuvem", "Microsserviços"],
  },
  {
    id: "senado-dba",
    title: {
      pt: "Analista de Banco de Dados e Informações",
      en: "Database and Information Analyst",
      es: "Analista de Base de Datos e Información",
    },
    organization: "Senado Federal",
    board: "FCC",
    salary: 31200,
    workMode: "Híbrido",
    vacancies: 8,
    registrationLink: "https://www.concursosfcc.com.br",
    registrationDeadline: daysFromNow(30),
    summary: {
      pt: "Modelar, otimizar e proteger bancos de dados legislativos de missão crítica, com forte foco em performance SQL e governança de dados.",
      en: "Model, optimize and secure mission-critical legislative databases, with a strong focus on SQL performance and data governance.",
      es: "Modelar, optimizar y asegurar bases de datos legislativas de misión crítica, con un fuerte enfoque en rendimiento SQL y gobernanza de datos.",
    },
    tags: ["Bancos de Dados", "SQL", "Governança de Dados", "Performance"],
  },
  {
    id: "tcu-infra",
    title: {
      pt: "Especialista em Infraestrutura e Nuvem",
      en: "Infrastructure & Cloud Specialist",
      es: "Especialista en Infraestructura y Nube",
    },
    organization: "Tribunal de Contas da União (TCU)",
    board: "Cebraspe",
    salary: 35462,
    workMode: "100% Remoto",
    vacancies: 6,
    registrationLink: "https://www.cebraspe.org.br/concursos",
    registrationDeadline: daysFromNow(7),
    summary: {
      pt: "Operar e auditar a zona de destino em nuvem federal, gerenciamento de serviços (ITIL 4) e continuidade de sistemas de controle críticos.",
      en: "Operate and audit the federal cloud landing zone, service management (ITIL 4) and continuity of critical control systems.",
      es: "Operar y auditar la zona de aterrizaje en la nube federal, gestión de servicios (ITIL 4) y continuidad de sistemas de control críticos.",
    },
    tags: ["Nuvem", "ITIL", "Infraestrutura", "Governança"],
  },
]

export const BOARD_PROFILES: Record<string, BoardProfile> = {
  Cebraspe: {
    board: "Cebraspe",
    fullName: "Cebraspe (antigo CESPE/UnB)",
    style: {
      pt: "Formato de item Certo/Errado com penalidade severa: uma resposta errada anula uma correta. Premia a precisão em vez do chute.",
      en: "True/False item format with severe penalty: a wrong answer cancels a correct one. Rewards precision over guessing.",
      es: "Formato de ítem Verdadero/Falso con penalización severa: una respuesta incorrecta anula una correcta. Premia la precisión en lugar de adivinar.",
    },
    trapPatterns: {
      pt: [
        "Termos absolutos ('sempre', 'nunca', 'exclusivamente') que generalizam um conceito quase verdadeiro.",
        "Trocas sutis de uma palavra (ex: 'deve' vs 'pode', 'disponibilidade' vs 'integridade') para inverter o significado.",
        "Premissas longas e verdadeiras terminando com uma única cláusula de conclusão falsa.",
        "Pontuação líquida negativa: deixar uma questão incerta em branco costuma ser melhor do que chutar.",
      ],
      en: [
        "Absolute wording ('always', 'never', 'exclusively') that overstates a mostly-true concept.",
        "Subtle swaps of one word (e.g. 'must' vs 'may', 'availability' vs 'integrity') to invert the meaning.",
        "Long true premises ending in a single false conclusion clause.",
        "Net-negative scoring: skipping an uncertain item is often better than guessing.",
      ],
      es: [
        "Términos absolutos ('siempre', 'nunca', 'exclusivamente') que generalizan un concepto casi verdadero.",
        "Intercambios sutiles de una palabra (ej: 'debe' vs 'puede') para invertir el significado.",
        "Premisas largas y verdaderas que terminan con una sola cláusula de conclusión falsa.",
        "Puntuación neta negativa: dejar una pregunta en blanco suele ser mejor que adivinar.",
      ],
    },
  },
  FGV: {
    board: "FGV",
    fullName: "Fundação Getulio Vargas",
    style: {
      pt: "Múltipla escolha (5 opções) longa e rica em contexto, com cenários aplicados e julgamentos de 'mais correto'.",
      en: "Multiple choice (5 options) long and context-rich, with applied scenarios and 'most correct' judgments.",
      es: "Opción múltiple (5 opciones) larga y rica en contexto, con escenarios aplicados y juicios de 'más correcto'.",
    },
    trapPatterns: {
      pt: [
        "Duas opções quase idênticas onde apenas uma atende plenamente às restrições do cenário.",
        "Distratores construídos a partir de frameworks reais, porém fora do escopo (ex: fase TOGAF nomeada em questão de COBIT).",
        "Estudos de caso com dados irrelevantes inseridos para testar o que você consegue ignorar.",
        "Enunciados negativos do tipo 'Exceto' / 'incorreto' que invertem a resposta esperada.",
      ],
      en: [
        "Two nearly identical options where only one fully meets the scenario's constraints.",
        "Distractors built from real frameworks, yet out of scope.",
        "Case studies with irrelevant data inserted to test what you can ignore.",
        "Negative statements like 'Except' / 'incorrect' that invert the expected answer.",
      ],
      es: [
        "Dos opciones casi idénticas donde solo una cumple plenamente con las restricciones.",
        "Distractores construidos a partir de marcos reales, pero fuera de alcance.",
        "Estudios de caso con datos irrelevantes para evaluar qué se puede ignorar.",
        "Enunciados negativos del tipo 'Excepto' / 'incorrecto'.",
      ],
    },
  },
  FCC: {
    board: "FCC",
    fullName: "Fundação Carlos Chagas",
    style: {
      pt: "Múltipla escolha (5 opções) literal e rica em definições, intimamente ligada à redação da documentação oficial.",
      en: "Multiple choice (5 options) literal and definition-rich, closely tied to official documentation phrasing.",
      es: "Opción múltiple (5 opciones) literal y rica en definiciones, ligada a la redacción oficial.",
    },
    trapPatterns: {
      pt: [
        "Definições textuais com um termo alterado que você precisa identificar.",
        "Questões de ordenação / sequência (ex: etapas da cadeia de valor ITIL) com um par invertido.",
        "Detalhes numéricos ou normativos extraídos diretamente de padrões (ISO, facilitadores COBIT).",
        "Distratores que misturam vocabulário de dois frameworks diferentes.",
      ],
      en: [
        "Textual definitions with an altered term you must identify.",
        "Ordering/sequence questions with an inverted pair.",
        "Numerical or normative details extracted directly from standards.",
        "Distractors mixing vocabulary from two different frameworks.",
      ],
      es: [
        "Definiciones textuales con un término alterado que debes identificar.",
        "Preguntas de ordenación / secuencia con un par invertido.",
        "Detalles numéricos extraídos directamente de normativas.",
        "Distractores que mezclan vocabulario de dos marcos diferentes.",
      ],
    },
  },
}

export const MODULES: Module[] = [
  {
    id: "cobit-2019",
    title: "Governança COBIT 2019",
    code: "GOV-101",
    description:
      "Governança corporativa de TI: governança vs gestão, os 40 objetivos, fatores de desenho e gestão de desempenho.",
    prerequisiteId: null,
    estimatedHours: 14,
    theory: [
      {
        heading: "Governança vs. Gestão",
        body: "O COBIT 2019 estabelece uma linha clara entre governança (domínio EDM — Avaliar, Direcionar e Monitorar — responsabilidade da alta administração de definir diretrizes) e gestão (domínios APO, BAI, DSS e MEA — responsabilidade executiva de planejar, construir, executar e monitorar).",
      },
      {
        heading: "O Modelo Core",
        body: "O modelo principal possui 40 objetivos de governança e gestão agrupados em 5 domínios. O EDM possui 5 objetivos; APO (Alinhar, Planejar e Organizar) possui 14; BAI (Construir, Adquirir e Implementar) possui 11; DSS (Entregar, Servir e Suportar) possui 6; MEA (Monitorar, Avaliar e Aferir) possui 4.",
      },
      {
        heading: "Fatores de Desenho",
        body: "Um sistema de governança customizado é construído a partir de fatores de desenho como estratégia, metas, perfil de risco, problemas de TI, cenário de ameaças, requisitos de conformidade e adoção de tecnologia.",
      },
    ],
    diagnostic: [
      {
        id: "cobit-d1",
        topic: "Governança vs Gestão",
        prompt:
          "No COBIT 2019, qual domínio contém os objetivos que são de responsabilidade direta do órgão regulador/diretoria?",
        options: ["APO", "EDM", "DSS", "BAI"],
        correctIndex: 1,
        explanation:
          "EDM (Avaliar, Direcionar e Monitorar) é o domínio de governança voltado à alta administração; os demais pertencem à gestão.",
      },
      {
        id: "cobit-d2",
        topic: "Modelo Core",
        prompt: "Quantos objetivos de governança e gestão o modelo core do COBIT 2019 define?",
        options: ["34", "37", "40", "5"],
        correctIndex: 2,
        explanation: "O COBIT 2019 define 40 objetivos distribuídos nos cinco domínios.",
      },
      {
        id: "cobit-d3",
        topic: "Fatores de Desenho",
        prompt: "Qual das alternativas é um fator de desenho do COBIT 2019 usado para customizar o sistema de governança?",
        options: ["Perfil de risco da empresa", "Limite WIP do Kanban", "Tamanho da janela TCP", "Forma de normalização"],
        correctIndex: 0,
        explanation: "O perfil de risco corporativo é um dos 11 fatores de desenho utilizados.",
      },
    ],
    drills: [
      {
        id: "cobit-dr1",
        topic: "Domínios",
        prompt: "O objetivo 'APO12 Gerenciar Riscos' pertence ao propósito de qual domínio?",
        options: ["Alinhar, Planejar e Organizar", "Entregar, Servir e Suportar", "Avaliar, Direcionar e Monitorar", "Construir, Adquirir e Implementar"],
        correctIndex: 0,
        explanation: "APO significa Alinhar, Planejar e Organizar; APO12 trata da gestão de riscos.",
      },
      {
        id: "cobit-dr2",
        topic: "Princípios do Sistema de Governança",
        prompt: "Qual é um dos seis princípios para um sistema de governança COBIT 2019?",
        options: [
          "Proporcionar valor às partes interessadas",
          "Maximizar a utilização do servidor",
          "Eliminar toda a documentação",
          "Centralizar todas as decisões",
        ],
        correctIndex: 0,
        explanation: "'Proporcionar valor às partes interessadas' é o primeiro princípio estrutural do COBIT.",
      },
      {
        id: "cobit-dr3",
        topic: "Componentes",
        prompt: "Processos, estruturas organizacionais e cultura são exemplos de ___ do COBIT 2019.",
        options: ["Componentes do sistema de governança", "Fatores de desenho", "Áreas de foco", "Níveis de capacidade"],
        correctIndex: 0,
        explanation: "Estes constituem os componentes do sistema de governança (antigos habilitadores no COBIT 5).",
      },
      {
        id: "cobit-dr4",
        topic: "Gestão de Desempenho",
        prompt: "O COBIT 2019 mede a capacidade de processos em uma escala de nível 0 até qual nível máximo?",
        options: ["Nível 3", "Nível 5", "Nível 7", "Nível 10"],
        correctIndex: 1,
        explanation: "A escala de capacidade baseada em CMMI vai de 0 a 5.",
      },
    ],
    exam: [
      {
        id: "cobit-e1",
        topic: "Governança vs Gestão",
        prompt: "Um item do Cebraspe afirma: 'Todos os objetivos de gestão do COBIT 2019 são de responsabilidade exclusiva do conselho de administração.' Julgue o item.",
        options: ["Certo", "Errado"],
        correctIndex: 1,
        explanation: "Os objetivos de gestão pertencem à alta gestão executiva, e não ao conselho — o termo absoluto torna o item errado.",
      },
      {
        id: "cobit-e2",
        topic: "Domínios",
        prompt: "Qual domínio é responsável por 'Entregar, Servir e Suportar'?",
        options: ["DSS", "BAI", "MEA", "EDM"],
        correctIndex: 0,
        explanation: "DSS = Deliver, Service and Support (Entregar, Servir e Suportar).",
      },
      {
        id: "cobit-e3",
        topic: "Modelo Core",
        prompt: "Quantos objetivos estão contidos no domínio EDM (governança)?",
        options: ["3", "5", "11", "14"],
        correctIndex: 1,
        explanation: "O domínio EDM possui 5 objetivos voltados para a governança.",
      },
      {
        id: "cobit-e4",
        topic: "Fatores de Desenho",
        prompt: "O que NÃO é um fator de desenho do COBIT 2019?",
        options: ["Cenário de ameaças", "Requisitos de conformidade", "Escolha do algoritmo de ordenação", "Papel da TI"],
        correctIndex: 2,
        explanation: "'Escolha do algoritmo de ordenação' refere-se ao desenvolvimento de software, não a um fator de governança.",
      },
    ],
  },
  {
    id: "itil-4",
    title: "Gerenciamento de Serviços ITIL 4",
    code: "SVC-201",
    description:
      "O Sistema de Valor de Serviço, as quatro dimensões, a Cadeia de Valor de Serviço e os princípios orientadores do gerenciamento moderno de serviços de TI.",
    prerequisiteId: "cobit-2019",
    estimatedHours: 12,
    theory: [
      {
        heading: "O Sistema de Valor de Serviço (SVS)",
        body: "O SVS descreve como todos os componentes e atividades de uma organização trabalham juntos para criar valor. Seus componentes são: princípios orientadores, governança, cadeia de valor de serviço, práticas e melhoria contínua.",
      },
      {
        heading: "As Quatro Dimensões",
        body: "Todo serviço deve ser avaliado em quatro dimensões: (1) Organizações e Pessoas, (2) Informação e Tecnologia, (3) Parceiros e Fornecedores, e (4) Fluxos de Valor e Processos.",
      },
      {
        heading: "A Cadeia de Valor de Serviço",
        body: "A cadeia de valor possui seis atividades principais: Planejar, Melhorar, Engajar, Projetar e Transicionar, Obter/Construir, e Entregar e Suportar.",
      },
    ],
    diagnostic: [
      {
        id: "itil-d1",
        topic: "Princípios Orientadores",
        prompt: "Qual é um dos sete princípios orientadores do ITIL 4?",
        options: ["Focar no valor", "Maximizar o uso da CPU", "Documentar tudo duas vezes", "Evitar automação"],
        correctIndex: 0,
        explanation: "'Focar no valor' é o primeiro princípio orientador do ITIL 4.",
      },
      {
        id: "itil-d2",
        topic: "Quatro Dimensões",
        prompt: "Qual é uma das quatro dimensões do gerenciamento de serviços?",
        options: ["Parceiros e fornecedores", "Firewalls e portas", "Sprints e reuniões diárias", "Servidores e racks"],
        correctIndex: 0,
        explanation: "Parceiros e fornecedores compõem uma das quatro dimensões essenciais.",
      },
      {
        id: "itil-d3",
        topic: "Cadeia de Valor",
        prompt: "Quantas atividades compõem a Cadeia de Valor de Serviço do ITIL 4?",
        options: ["4", "5", "6", "7"],
        correctIndex: 2,
        explanation: "A cadeia de valor é composta por 6 atividades.",
      },
    ],
    drills: [
      {
        id: "itil-dr1",
        topic: "Cadeia de Valor",
        prompt: "Qual atividade da cadeia de valor garante uma compreensão compartilhada da visão e direção?",
        options: ["Planejar", "Engajar", "Entregar e Suportar", "Melhorar"],
        correctIndex: 0,
        explanation: "A atividade 'Planejar' assegura a compreensão compartilhada da direção estratégica.",
      },
      {
        id: "itil-dr2",
        topic: "Práticas",
        prompt: "O objetivo principal da prática de 'Gerenciamento de Incidentes' é:",
        options: [
          "Restabelecer a operação normal do serviço o mais rápido possível",
          "Impedir que qualquer alteração ocorra",
          "Projetar novos serviços do zero",
          "Negociar contratos com fornecedores",
        ],
        correctIndex: 0,
        explanation: "O foco do gerenciamento de incidentes é mitigar o impacto adverso restaurando o serviço rapidamente.",
      },
      {
        id: "itil-dr3",
        topic: "Princípios Orientadores",
        prompt: "O princípio 'Começar de onde você está' recomenda principalmente:",
        options: [
          "Avaliar o estado atual antes de criar algo novo",
          "Sempre reconstruir sistemas do zero",
          "Ignorar métricas existentes",
          "Terceirizar tudo imediatamente",
        ],
        correctIndex: 0,
        explanation: "Evita desperdícios analisando o que já existe e pode ser aproveitado.",
      },
      {
        id: "itil-dr4",
        topic: "Conceitos",
        prompt: "No ITIL 4, o termo 'garantia' (warranty) refere-se a:",
        options: ["Adequação para uso (desempenho, segurança, capacidade)", "Adequação para propósito (o que o serviço faz)", "Cláusula de penalidade", "Garantia de hardware"],
        correctIndex: 0,
        explanation: "Garantia = adequação para uso (como o serviço desempenha); utilidade = adequação para propósito (o que ele faz).",
      },
    ],
    exam: [
      {
        id: "itil-e1",
        topic: "SVS",
        prompt: "O que NÃO é um componente do Sistema de Valor de Serviço (SVS) do ITIL 4?",
        options: ["Princípios orientadores", "Cadeia de valor de serviço", "Melhoria contínua", "Revisões de portão em cascata (Waterfall gate reviews)"],
        correctIndex: 3,
        explanation: "Revisões de portão tradicionais não fazem parte dos componentes oficiais do SVS.",
      },
      {
        id: "itil-e2",
        topic: "Quatro Dimensões",
        prompt: "Negligenciar a dimensão 'Fluxos de Valor e Processos' traz o risco direto de:",
        options: ["Trabalho ineficiente e mal coordenado", "Contas de eletricidade mais altas", "Menos fornecedores", "CPUs mais lentas"],
        correctIndex: 0,
        explanation: "A falta de atenção aos fluxos de valor gera ineficiência operacional.",
      },
      {
        id: "itil-e3",
        topic: "Utlidade vs Garantia",
        prompt: "Um serviço que executa o que é necessário, mas está constantemente fora do ar, carece de:",
        options: ["Garantia", "Utlidade", "Preço", "Proprietário"],
        correctIndex: 0,
        explanation: "Ele possui utilidade, mas carece de garantia (disponibilidade/confiabilidade).",
      },
      {
        id: "itil-e4",
        topic: "Cadeia de Valor",
        prompt: "Qual atividade da cadeia de valor é responsável por mover componentes novos ou alterados para o ambiente de produção?",
        options: ["Projetar e transicionar", "Engajar", "Planejar", "Melhorar"],
        correctIndex: 0,
        explanation: "A transição garante que os serviços atendam às especificações ao entrarem em operação.",
      },
    ],
  },
  {
    id: "sql-databases",
    title: "SQL e Bancos de Dados",
    code: "DAT-301",
    description:
      "Modelagem relacional, normalização, transações ACID, junções (joins), indexação e desempenho de consultas — a base de qualquer concurso de TI.",
    prerequisiteId: "itil-4",
    estimatedHours: 16,
    theory: [
      {
        heading: "Propriedades ACID",
        body: "Transações confiáveis garantem Atomicidade (tudo ou nada), Consistência (estado válido para estado válido), Isolamento (transações concorrentes não interferem) e Durabilidade (dados confirmados sobrevivem a falhas).",
      },
      {
        heading: "Normalização",
        body: "A 1FN remove grupos repetitivos. A 2FN remove dependências parciais de chaves compostas. A 3FN remove dependências transitivas. A BCNF é uma forma mais restrita.",
      },
      {
        heading: "Junções e Indexação",
        body: "INNER JOIN retorna linhas correspondentes; LEFT JOIN mantém todas as linhas da esquerda. Índices aceleram buscas, mas encarecem operações de gravação.",
      },
    ],
    diagnostic: [
      {
        id: "sql-d1",
        topic: "ACID",
        prompt: "A letra 'D' em ACID garante que os dados confirmados:",
        options: ["Sobrevivem a falhas do sistema", "Estão sempre criptografados", "Estão na 3FN", "Permanecem apenas na RAM"],
        correctIndex: 0,
        explanation: "A durabilidade garante que as modificações persistidas não sejam perdidas em falhas.",
      },
      {
        id: "sql-d2",
        topic: "Joins",
        prompt: "Qual junção retorna todas as linhas da tabela à esquerda e as correspondentes à direita?",
        options: ["LEFT (OUTER) JOIN", "INNER JOIN", "CROSS JOIN", "SELF JOIN"],
        correctIndex: 0,
        explanation: "O LEFT JOIN preserva o conjunto completo da esquerda.",
      },
      {
        id: "sql-d3",
        topic: "Normalização",
        prompt: "Eliminar dependências parciais em relação à chave primária composta atinge qual forma normal?",
        options: ["2FN", "1FN", "3FN", "BCNF"],
        correctIndex: 0,
        explanation: "A Segunda Forma Normal (2FN) remove dependências parciais.",
      },
    ],
    drills: [
      {
        id: "sql-dr1",
        topic: "Sintaxe SQL",
        prompt: "Qual cláusula filtra linhas APÓS a agregação (GROUP BY)?",
        options: ["HAVING", "WHERE", "ORDER BY", "LIMIT"],
        correctIndex: 0,
        explanation: "O HAVING opera em grupos filtrados, enquanto o WHERE opera antes do agrupamento.",
      },
      {
        id: "sql-dr2",
        topic: "Indexação",
        prompt: "Um índice de cobertura (covering index) é aquele que:",
        options: [
          "Contém todas as colunas necessárias para a consulta",
          "Cobre a tabela inteira no disco",
          "É sempre clusterizado",
          "Impede todas as gravações",
        ],
        correctIndex: 0,
        explanation: "Atende à consulta sem precisar acessar as páginas de dados da tabela principal.",
      },
      {
        id: "sql-dr3",
        topic: "Chaves",
        prompt: "Uma chave estrangeira impõe:",
        options: [
          "Integridade referencial entre tabelas",
          "Unicidade absoluta de qualquer coluna",
          "Indexação automática de todas as linhas",
          "Criptografia de colunas",
        ],
        correctIndex: 0,
        explanation: "Garante que o valor inserido corresponda a um registro válido na tabela referenciada.",
      },
      {
        id: "sql-dr4",
        topic: "Transações",
        prompt: "Qual nível de isolamento evita leituras sujas (dirty reads), mas ainda permite leituras não repetíveis?",
        options: ["READ COMMITTED", "READ UNCOMMITTED", "SERIALIZABLE", "SNAPSHOT"],
        correctIndex: 0,
        explanation: "O Read Committed evita leituras sujas, permitindo variações em leituras repetidas dentro da mesma transação.",
      },
    ],
    exam: [
      {
        id: "sql-e1",
        topic: "Normalização",
        prompt: "Uma tabela em 3FN onde um atributo não chave determina parte da chave primária viola qual forma mais estrita?",
        options: ["BCNF", "1FN", "2FN", "0FN"],
        correctIndex: 0,
        explanation: "A Forma Normal de Boyce-Codd exige que todo determinante seja uma chave candidata.",
      },
      {
        id: "sql-e2",
        topic: "Sintaxe SQL",
        prompt: "SELECT dept, COUNT(*) FROM emp GROUP BY dept HAVING COUNT(*) > 5 retorna:",
        options: ["Departamentos com mais de 5 funcionários", "Todos os funcionários", "Os 5 maiores departamentos", "Funcionários contratados após o quinto"],
        correctIndex: 0,
        explanation: "Filtra e exibe apenas os grupos (departamentos) cuja contagem excede 5.",
      },
      {
        id: "sql-e3",
        topic: "ACID",
        prompt: "Duas transações simultâneas não devem ver as alterações não confirmadas uma da outra. Isso é:",
        options: ["Isolamento", "Atomicidade", "Durabilidade", "Consistência"],
        correctIndex: 0,
        explanation: "O isolamento protege transações concorrentes contra interferência mútua.",
      },
      {
        id: "sql-e4",
        topic: "Indexação",
        prompt: "Adicionar muitos índices a uma tabela com alta taxa de gravação causa principalmente:",
        options: ["Lentidão nas operações de INSERT/UPDATE", "Aceleração em todas as gravações", "Dispensa da chave primária", "Garantia automática de 3FN"],
        correctIndex: 0,
        explanation: "Cada índice deve ser atualizado a cada modificação, tornando os comandos de gravação mais caros.",
      },
    ],
  },
  {
    id: "software-architecture",
    title: "Arquitetura de Software",
    code: "ARC-401",
    description:
      "Estilos arquiteturais, atributos de qualidade, microsserviços vs monólitos, padrões de resiliência e design de APIs para grandes sistemas.",
    prerequisiteId: "sql-databases",
    estimatedHours: 18,
    theory: [
      {
        heading: "Atributos de Qualidade",
        body: "A arquitetura é guiada por atributos não funcionais: disponibilidade, escalabilidade, desempenho, segurança, manutenibilidade e interoperabilidade.",
      },
      {
        heading: "Monólito vs Microsserviços",
        body: "Um monólito é simples de construir e implantar, mas difícil de escalar seletivamente. Microsserviços oferecem escalabilidade isolada ao custo de complexidade distribuída.",
      },
      {
        heading: "Padrões de Resiliência",
        body: "Disjuntores (circuit breakers) interrompem chamadas para serviços com falha. Anteparos (bulkheads) isolam recursos. Estratégias de repetição evitam falhas em cascata.",
      },
    ],
    diagnostic: [
      {
        id: "arc-d1",
        topic: "Padrões",
        prompt: "Qual padrão evita chamadas repetidas a um serviço dependente que está falhando?",
        options: ["Disjuntor (Circuit breaker)", "Singleton", "Observer", "Factory"],
        correctIndex: 0,
        explanation: "O disjuntor abre temporariamente o circuito para poupar o sistema com falha.",
      },
      {
        id: "arc-d2",
        topic: "Estilos",
        prompt: "A capacidade de implantar pequenos serviços de forma independente descreve melhor:",
        options: ["Microsserviços", "Monólito", "Processamento em lote", "SPA puramente cliente"],
        correctIndex: 0,
        explanation: "Implantação e entrega independentes caracterizam os microsserviços.",
      },
      {
        id: "arc-d3",
        topic: "Atributos de Qualidade",
        prompt: "'O sistema deve suportar 10x mais usuários no próximo ano' refere-se principalmente a:",
        options: ["Escalabilidade", "Usabilidade", "Portabilidade", "Localização"],
        correctIndex: 0,
        explanation: "A capacidade de absorver o crescimento de carga sem perda de eficiência é a escalabilidade.",
      },
    ],
    drills: [
      {
        id: "arc-dr1",
        topic: "Resiliência",
        prompt: "O padrão 'anteparo' (bulkhead) fornece principalmente:",
        options: [
          "Isolamento de pools de recursos para que uma falha não derrube todo o sistema",
          "Normalização automática de banco de dados",
          "Maior velocidade de clock da CPU",
          "Hash de senha mais robusto",
        ],
        correctIndex: 0,
        explanation: "Semelhante a compartimentos estanques em um navio, isola falhas em domínios específicos.",
      },
      {
        id: "arc-dr2",
        topic: "APIs",
        prompt: "Tornar uma requisição POST segura para ser repetida sem duplicar efeitos colaterais geralmente depende de:",
        options: ["Chaves de idempotência", "Timeouts mais longos", "Remoção de banco de dados", "Desativação de TLS"],
        correctIndex: 0,
        explanation: "Permite que o servidor reconheça repetições e processe a transação apenas uma vez.",
      },
      {
        id: "arc-dr3",
        topic: "Consistência",
        prompt: "Em sistemas distribuídos, o teorema CAP afirma que devemos equilibrar Consistência, Disponibilidade e:",
        options: ["Tolerância a partições", "Portabilidade", "Desempenho", "Persistência"],
        correctIndex: 0,
        explanation: "CAP = Consistência (Consistency), Disponibilidade (Availability), Tolerância a partições (Partition tolerance).",
      },
      {
        id: "arc-dr4",
        topic: "Estilos",
        prompt: "Arquiteturas orientadas a eventos melhoram principalmente:",
        options: ["Baixo acoplamento e escalabilidade assíncrona", "Renderização de fontes", "Normalização SQL", "Organização física de cabos"],
        correctIndex: 0,
        explanation: "Desacoplam emissores e consumidores por meio de eventos assíncronos.",
      },
    ],
    exam: [
      {
        id: "arc-e1",
        topic: "Compromissos (Trade-offs)",
        prompt: "Cenário FGV: uma equipe pequena precisa de velocidade de entrega rápida para uma ferramenta interna simples. O estilo inicial mais adequado costuma ser:",
        options: ["Um monólito modular", "Uma malha com 30 microsserviços", "Um cluster de atores distribuídos", "Uma rede blockchain"],
        correctIndex: 0,
        explanation: "Para equipes enxutas e escopo focado, um monólito modular elimina a sobrecarga inerente aos sistemas distribuídos.",
      },
      {
        id: "arc-e2",
        topic: "Resiliência",
        prompt: "Qual combinação mitiga melhor falhas em cascata causadas por uma dependência lenta?",
        options: [
          "Timeouts + disjuntor + anteparos (bulkheads)",
          "Apenas repetições infinitas (retries)",
          "Um monólito maior",
          "Remoção de todos os logs",
        ],
        correctIndex: 0,
        explanation: "Esses mecanismos juntos evitam o esgotamento de conexões e threads.",
      },
      {
        id: "arc-e3",
        topic: "CAP",
        prompt: "Durante uma partição de rede, um sistema do tipo AP escolhe:",
        options: ["Manter a disponibilidade e flexibilizar a consistência", "Parar completamente os serviços", "Garantir leituras linearizáveis", "Excluir a partição"],
        correctIndex: 0,
        explanation: "Sistemas AP priorizam continuar respondendo aos usuários, aceitando inconsistências eventuais temporárias.",
      },
      {
        id: "arc-e4",
        topic: "Atributos de Qualidade",
        prompt: "O que NÃO é primariamente um atributo de qualidade em tempo de execução?",
        options: ["Manutenibilidade", "Disponibilidade", "Desempenho", "Escalabilidade"],
        correctIndex: 0,
        explanation: "A manutenibilidade está vinculada ao código-fonte e ao ciclo de vida de desenvolvimento, avaliada na fase de design/engenharia.",
      },
    ],
  },
]

export const SIMULATION_IDS = ["sim-1", "sim-2", "sim-3"]

export function getLocalizedText(field: Record<Language, string> | string, lang: Language): string {
  if (typeof field === "object" && field !== null && lang in field) {
    return field[lang]
  }
  return typeof field === "string" ? field : (field as Record<Language, string>)["pt"] || ""
}

export function getLocalizedList(
  field: Record<Language, string[]> | string[],
  lang: Language,
): string[] {
  if (Array.isArray(field)) return field
  return field[lang] || field.pt || []
}

export function getModule(id: string | null): Module | undefined {
  return MODULES.find((m) => m.id === id)
}

export function getContest(id: string | null): Contest | undefined {
  return CONTESTS.find((c) => c.id === id)
}