/**
 * Seed Dataset for Berglunds Byggtjänst AI Demo
 * 
 * These are realistic demo projects based on typical Swedish renovation costs
 * in the Östersund/Jämtland region. Used for RAG similarity search.
 * 
 * Cost basis (2024 market rates):
 * - Takbyte: 600-1000 kr/kvm (material + arbete)
 * - Badrum: 8,000-15,000 kr/kvm totalrenovering
 * - Kök: 5,000-12,000 kr/kvm (exkl. vitvaror)
 * - Tillbyggnad: 12,000-20,000 kr/kvm
 * - ROT-avdrag: 30% på arbetskostnaden, max 50,000 kr/person/år
 */

export interface ProjectMetadata {
  cost_estimate: number // Total cost in SEK
  cost_range: [number, number] // [min, max] for estimate range
  labor_cost: number // Approximate labor portion (for ROT calculation)
  rot_avdrag_eligible: boolean
  rot_avdrag_amount: number // 30% of labor_cost, max 50,000
  cost_after_rot: number
  time_estimate: string // e.g., "2-3 veckor"
  square_meters: number
  year_completed: number
  materials: string[]
  location: string
  difficulty: 'easy' | 'medium' | 'complex'
  project_highlights: string[]
}

export interface SeedProject {
  id: string
  project_type: 'takbyten' | 'badrumsrenovering' | 'köksrenovering' | 'nybyggnation' | 'tillbyggnad' | 'ombyggnation' | 'snickeri' | 'fasad' | 'annat'
  title: string
  description: string
  short_description: string
  metadata: ProjectMetadata
  images: {
    before?: string
    after?: string
    during?: string[]
  }
  similar_projects: string[] // IDs of related projects
}

export const SEED_PROJECTS: SeedProject[] = [
  // ========== TAKBYTEN (3 projects) ==========
  {
    id: 'tak-001',
    project_type: 'takbyten',
    title: 'Komplett takbyte villa Söder',
    description: 'Totalbyte av tak på 140 kvm enfamiljsvilla i Östersund. Gammalt betongtak med läckage byttes mot nytt stående falsad plåttak i antracitgrått. Inkluderade byte av vindskivor, läkt och tilläggsisolering.',
    short_description: '140 kvm plåttak med isolering',
    metadata: {
      cost_estimate: 185000,
      cost_range: [165000, 205000],
      labor_cost: 95000,
      rot_avdrag_eligible: true,
      rot_avdrag_amount: 28500,
      cost_after_rot: 156500,
      time_estimate: '4-5 arbetsdagar',
      square_meters: 140,
      year_completed: 2023,
      materials: ['Stående falsad plåt', 'Takpapp', 'Läkt', 'Vindskivor i trä'],
      location: 'Östersund',
      difficulty: 'medium',
      project_highlights: [
        'Tätskikt garanterat i 30 år',
        'Förbättrad isolering minskar uppvärmningskostnader',
        'Modern antracitgrå finish'
      ]
    },
    images: {
      before: '/seed/tak-001-before.jpg',
      after: '/seed/tak-001-after.jpg'
    },
    similar_projects: ['tak-002', 'tak-003']
  },
  {
    id: 'tak-002',
    project_type: 'takbyten',
    title: 'Takbyte tegel till betongpannor',
    description: 'Byte av slitet tegeltak till nya betongpannor på 95 kvm fritidshus i Lit. Kompletterat med nya takrännor och säkerhetsanordningar för snö.',
    short_description: '95 kvm betongpannor med nya rännor',
    metadata: {
      cost_estimate: 145000,
      cost_range: [130000, 160000],
      labor_cost: 75000,
      rot_avdrag_eligible: true,
      rot_avdrag_amount: 22500,
      cost_after_rot: 122500,
      time_estimate: '3-4 arbetsdagar',
      square_meters: 95,
      year_completed: 2024,
      materials: ['Betongtakpannor', 'Takpapp', 'Takrännor aluminium', 'Snörasskydd'],
      location: 'Lit',
      difficulty: 'easy',
      project_highlights: [
        'Betongpannor håller 50+ år',
        'Komplett system med rännor',
        'Snösäkert för fjällmiljö'
      ]
    },
    images: {
      before: '/seed/tak-002-before.jpg',
      after: '/seed/tak-002-after.jpg'
    },
    similar_projects: ['tak-001', 'tak-003']
  },
  {
    id: 'tak-003',
    project_type: 'takbyten',
    title: 'Nödtakbyte efter stormskador',
    description: 'Akut takbyte efter stormskador på 180 kvm lantbruksfastighet i Hackås. Befintligt plåttak blåste av - ersattes med förstärkt konstruktion och ny plåt.',
    short_description: '180 kvm akut plåttak med förstärkning',
    metadata: {
      cost_estimate: 245000,
      cost_range: [220000, 270000],
      labor_cost: 125000,
      rot_avdrag_eligible: true,
      rot_avdrag_amount: 37500,
      cost_after_rot: 207500,
      time_estimate: '6-7 arbetsdagar',
      square_meters: 180,
      year_completed: 2023,
      materials: ['Förstärkt plåt', 'Extra läktning', 'Tätskikt', 'Vindskivor'],
      location: 'Hackås',
      difficulty: 'complex',
      project_highlights: [
        'Förstärkt för extrema väderförhållanden',
        'Akutinsats inom 48 timmar',
        '30-års garanti på utförande'
      ]
    },
    images: {
      before: '/seed/tak-003-before.jpg',
      after: '/seed/tak-003-after.jpg'
    },
    similar_projects: ['tak-001', 'tak-002']
  },

  // ========== BADRUM (2 projects) ==========
  {
    id: 'bad-001',
    project_type: 'badrumsrenovering',
    title: 'Totalrenovering badrum 6 kvm',
    description: 'Komplett renovering av 6 kvm badrum i 70-talsvilla. Rivning av befintligt, nytt tätskikt, kakel, klinker med golvvärme, ny inredning och duschvägg.',
    short_description: '6 kvm komplett badrum med golvvärme',
    metadata: {
      cost_estimate: 185000,
      cost_range: [165000, 205000],
      labor_cost: 105000,
      rot_avdrag_eligible: true,
      rot_avdrag_amount: 31500,
      cost_after_rot: 153500,
      time_estimate: '2-3 veckor',
      square_meters: 6,
      year_completed: 2024,
      materials: ['Kakel', 'Klinker', 'Golvvärme el', 'Duschvägg', 'Kommod', 'Toalett'],
      location: 'Östersund',
      difficulty: 'complex',
      project_highlights: [
        'Vattenburen golvvärme i hela badrummet',
        'Tätskikt certifierat enligt BBV',
        'Modern skandinavisk design'
      ]
    },
    images: {
      before: '/seed/bad-001-before.jpg',
      after: '/seed/bad-001-after.jpg'
    },
    similar_projects: ['bad-002']
  },
  {
    id: 'bad-002',
    project_type: 'badrumsrenovering',
    title: 'Badrumsrenovering liten lägenhet',
    description: 'Renovering av 4 kvm badrum i lägenhet. Byte av våtrumsmatta, ny wc, ny handfat och dusch. Anpassat för liten yta med smart förvaring.',
    short_description: '4 kvm badrum med våtrumsmatta',
    metadata: {
      cost_estimate: 125000,
      cost_range: [110000, 140000],
      labor_cost: 70000,
      rot_avdrag_eligible: true,
      rot_avdrag_amount: 21000,
      cost_after_rot: 104000,
      time_estimate: '10-12 arbetsdagar',
      square_meters: 4,
      year_completed: 2023,
      materials: ['Våtrumsmatta', 'Våtrumspanel', 'Dusch', 'Kommod', 'Toalett'],
      location: 'Östersund',
      difficulty: 'medium',
      project_highlights: [
        'Optimerad förvaring i litet utrymme',
        'Slitstark våtrumsmatta',
        'Handikappanpassad dusch'
      ]
    },
    images: {
      before: '/seed/bad-002-before.jpg',
      after: '/seed/bad-002-after.jpg'
    },
    similar_projects: ['bad-001']
  },

  // ========== KÖK (2 projects) ==========
  {
    id: 'kok-001',
    project_type: 'köksrenovering',
    title: 'Dröm Köksrenovering 12 kvm',
    description: 'Totalrenovering av 12 kvm kök i villa från 80-talet. Rivning, ny el, nytt golv, målning, köksinredning från Marbodal med vitvaror från Siemens.',
    short_description: '12 kvm komplett kök med vita luckor',
    metadata: {
      cost_estimate: 285000,
      cost_range: [255000, 315000],
      labor_cost: 135000,
      rot_avdrag_eligible: true,
      rot_avdrag_amount: 40500,
      cost_after_rot: 244500,
      time_estimate: '3-4 veckor',
      square_meters: 12,
      year_completed: 2024,
      materials: ['Köksinredning Marbodal', 'Bänkskiva komposit', 'Kakel ovanför bänk', 'Golv laminat', 'Spotlights'],
      location: 'Östersund',
      difficulty: 'medium',
      project_highlights: [
        'Smart förvaring med utdrag',
        'Integrerade vitvaror',
        'Belysning i flera zoner'
      ]
    },
    images: {
      before: '/seed/kok-001-before.jpg',
      after: '/seed/kok-001-after.jpg'
    },
    similar_projects: ['kok-002']
  },
  {
    id: 'kok-002',
    project_type: 'köksrenovering',
    title: 'Köksmakeover med bevarad charm',
    description: 'Delvis renovering av 10 kvm kök i 40-talsvilla. Bevarade originalskåp, nya bänkskivor, ny kran, målning och ny belysning. Respekt för husets ålder.',
    short_description: '10 kvm kök med bevarad charm',
    metadata: {
      cost_estimate: 145000,
      cost_range: [125000, 165000],
      labor_cost: 75000,
      rot_avdrag_eligible: true,
      rot_avdrag_amount: 22500,
      cost_after_rot: 122500,
      time_estimate: '1-2 veckor',
      square_meters: 10,
      year_completed: 2023,
      materials: ['Bänkskiva ek', 'Mässingsblandare', 'Tapet', 'Målarfärg', 'LED-belysning'],
      location: 'Frösön',
      difficulty: 'medium',
      project_highlights: [
        'Bevarade originaldetaljer',
        'Mässingsdetaljer matchar epoken',
        'Ekologiska materialval'
      ]
    },
    images: {
      before: '/seed/kok-002-before.jpg',
      after: '/seed/kok-002-after.jpg'
    },
    similar_projects: ['kok-001']
  },

  // ========== TILLBYGGNAD (1 project) ==========
  {
    id: 'till-001',
    project_type: 'tillbyggnad',
    title: 'Utbyggnad uterum 20 kvm',
    description: 'Tillbyggnad av 20 kvm uterum med altandörrar i glas. Trädäck utanför, isolerat tak, elinstallation för belysning och värme.',
    short_description: '20 kvm uterum med glaspartier',
    metadata: {
      cost_estimate: 485000,
      cost_range: [435000, 535000],
      labor_cost: 225000,
      rot_avdrag_eligible: true,
      rot_avdrag_amount: 50000, // Max gräns nådd
      cost_after_rot: 435000,
      time_estimate: '4-6 veckor',
      square_meters: 20,
      year_completed: 2024,
      materials: ['Träreglar', 'Isolering', 'Glaspartier', 'Trädäck', 'Takpapp', 'Elcentral'],
      location: 'Östersund',
      difficulty: 'complex',
      project_highlights: [
        'Helglasade väggar för maximal utsikt',
        'Integrerat trädäck',
        'Färdig för eldstad installation'
      ]
    },
    images: {
      before: '/seed/till-001-before.jpg',
      after: '/seed/till-001-after.jpg'
    },
    similar_projects: ['omb-001']
  },

  // ========== OMBYGATION (1 project) ==========
  {
    id: 'omb-001',
    project_type: 'ombyggnation',
    title: 'Öppna upp kök och vardagsrum',
    description: 'Ombyggnad för att öppna upp mellan kök och vardagsrum. Rivning av bärande vägg krävde stålbalk. Ny el, golv och målning i hela ytan.',
    short_description: 'Öppen planlösning med balk',
    metadata: {
      cost_estimate: 225000,
      cost_range: [195000, 255000],
      labor_cost: 115000,
      rot_avdrag_eligible: true,
      rot_avdrag_amount: 34500,
      cost_after_rot: 190500,
      time_estimate: '2-3 veckor',
      square_meters: 35,
      year_completed: 2023,
      materials: ['Stålbalk', 'Gipsskivor', 'Golv ek', 'Målarfärg', 'El'],
      location: 'Östersund',
      difficulty: 'complex',
      project_highlights: [
        'Bygglov och konstruktör anlitad',
        'Dold stålbalk i tak',
        'Sammanhängande golv i hela ytan'
      ]
    },
    images: {
      before: '/seed/omb-001-before.jpg',
      after: '/seed/omb-001-after.jpg'
    },
    similar_projects: ['till-001']
  },

  // ========== FASAD (1 project) ==========
  {
    id: 'fas-001',
    project_type: 'fasad',
    title: 'Fasadmålning villa komplett',
    description: 'Komplett fasadmålning av 180 kvm villa. Skrapning av gammal färg, grundmålning, 2 strykningar med silikatfärg. Byte av skadade brädor.',
    short_description: '180 kvm fasadmålning',
    metadata: {
      cost_estimate: 165000,
      cost_range: [145000, 185000],
      labor_cost: 95000,
      rot_avdrag_eligible: true,
      rot_avdrag_amount: 28500,
      cost_after_rot: 136500,
      time_estimate: '2-3 veckor',
      square_meters: 180,
      year_completed: 2024,
      materials: ['Silikatfärg', 'Grundfärg', 'Fasadbrädor', 'Täckmateriel'],
      location: 'Östersund',
      difficulty: 'medium',
      project_highlights: [
        'Silikatfärg andas och håller länge',
        'Byte av skadat virke',
        '10-års garanti på måleriarbete'
      ]
    },
    images: {
      before: '/seed/fas-001-before.jpg',
      after: '/seed/fas-001-after.jpg'
    },
    similar_projects: []
  }
]

// Helper functions
export const getProjectsByType = (type: string): SeedProject[] => {
  return SEED_PROJECTS.filter(p => p.project_type === type)
}

export const getProjectById = (id: string): SeedProject | undefined => {
  return SEED_PROJECTS.find(p => p.id === id)
}

export const getSimilarProjects = (project: SeedProject): SeedProject[] => {
  return SEED_PROJECTS.filter(p => project.similar_projects.includes(p.id))
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0
  }).format(amount)
}

export const calculateROTAvgdrag = (laborCost: number): number => {
  return Math.min(laborCost * 0.3, 50000)
}

// Cost estimate explanation template
export const generateCostExplanation = (project: SeedProject): string => {
  const m = project.metadata
  return `
Baserat på liknande projekt:

**${project.title}**
📍 ${m.location} | ${m.year_completed}
📐 ${m.square_meters} kvm

**Uppskattad kostnad:** ${formatCurrency(m.cost_estimate)}
**Kostnadsintervall:** ${formatCurrency(m.cost_range[0])} - ${formatCurrency(m.cost_range[1])}

💰 **ROT-avdrag:** ${formatCurrency(m.rot_avdrag_amount)} (30% av arbetskostnad)
**Efter avdrag:** ${formatCurrency(m.cost_after_rot)}

⏱️ **Tidsåtgång:** ${m.time_estimate}
🔧 **Material:** ${m.materials.slice(0, 3).join(', ')}${m.materials.length > 3 ? '...' : ''}

${m.project_highlights.map(h => `✓ ${h}`).join('\n')}

⚠️ *Detta är en uppskattning baserad på tidigare projekt. Kontakta oss för en exakt offert efter besiktning.*
  `.trim()
}
