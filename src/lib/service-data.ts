import { LucideIcon } from 'lucide-react'

export type IconName = 
  | 'Search'
  | 'FileText'
  | 'Hammer'
  | 'CheckCircle'
  | 'Lightbulb'
  | 'Building2'
  | 'Key'
  | 'Droplets'
  | 'Square'
  | 'Grid3X3'
  | 'Wrench'
  | 'Receipt'
  | 'Layout'
  | 'Paintbrush'
  | 'Zap'
  | 'ArrowUp'
  | 'DoorOpen'
  | 'Boxes'
  | 'Sofa'
  | 'Ruler'

export interface TimelineStep {
  number: string
  title: string
  description: string
  icon: IconName
}

export interface AccordionItem {
  id: string
  icon: IconName
  title: string
  content: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ServiceStats {
  duration: string
  durationValue: string
  response: string
  responseValue: string
  warranty: string
  warrantyValue: string
}

export interface ServicePageData {
  pattern: 'timeline' | 'accordion'
  timelineSteps?: TimelineStep[]
  accordionItems?: AccordionItem[]
  faqs: FAQItem[]
  stats: ServiceStats
}

export const servicePageData: Record<string, ServicePageData> = {
  takbyten: {
    pattern: 'timeline',
    timelineSteps: [
      {
        number: '01',
        title: 'Besiktning',
        description: 'Vi inspekterar taket och identifierar skador',
        icon: 'Search',
      },
      {
        number: '02',
        title: 'Offert & planering',
        description: 'Kostnadsfri offert inom 24h, material väljs',
        icon: 'FileText',
      },
      {
        number: '03',
        title: 'Genomförande',
        description: 'Professionellt utförande, vi städar efter oss',
        icon: 'Hammer',
      },
      {
        number: '04',
        title: 'Slutbesiktning',
        description: 'Gemensam genomgång, du godkänner resultatet',
        icon: 'CheckCircle',
      },
    ],
    faqs: [
      {
        question: 'Hur lång tid tar ett takbyte?',
        answer:
          'Ett normalt takbyte tar 3–7 arbetsdagar beroende på takets storlek och material. Vi informerar dig om tidsplan innan vi börjar.',
      },
      {
        question: 'Kan ni jobba på vintern?',
        answer:
          'Ja. Vi är utrustade för Jämtlands klimat och arbetar året runt, även vid kyla och snö.',
      },
      {
        question: 'Ingår städning?',
        answer:
          'Alltid. Vi lämnar din tomt i bättre skick än vi fann den.',
      },
      {
        question: 'Vad kostar ett takbyte?',
        answer:
          'Det beror på storlek och material. Kontakta oss för en kostnadsfri besiktning och offert inom 24 timmar.',
      },
      {
        question: 'Hanterar ni bygglovsansökan?',
        answer:
          'För enklare takbyten krävs inget bygglov. För mer omfattande förändringar hjälper vi till med ansökan.',
      },
      {
        question: 'Gäller ROT-avdrag för takarbeten?',
        answer:
          'Ja, ROT-avdrag gäller för arbete på tak. Material ingår inte i avdraget. Vi hanterar ansökan åt dig.',
      },
    ],
    stats: {
      duration: '3–7 dagar',
      durationValue: '5',
      response: '24h',
      responseValue: '24',
      warranty: '5 år garanti',
      warrantyValue: '5',
    },
  },

  badrumsrenovering: {
    pattern: 'accordion',
    accordionItems: [
      {
        id: 'vvs',
        icon: 'Droplets',
        title: 'VVS-arbeten',
        content:
          'Certifierade rörmokare, allt från blandare till dolda rör',
      },
      {
        id: 'taskikt',
        icon: 'Square',
        title: 'Tätskikt',
        content:
          'Godkänt tätskikt enligt BBV, garanterad vattentäthet',
      },
      {
        id: 'kakel',
        icon: 'Grid3X3',
        title: 'Kakel & klinker',
        content:
          'Professionell läggning, alla format och mönster',
      },
      {
        id: 'snickeri',
        icon: 'Wrench',
        title: 'Snickeriarbeten',
        content:
          'Badrumsspecifika snickerier, spegel, hylla, list',
      },
      {
        id: 'besiktning',
        icon: 'CheckCircle',
        title: 'Slutbesiktning',
        content:
          'Vi slutbesiktigar tillsammans innan vi lämnar',
      },
      {
        id: 'rot',
        icon: 'Receipt',
        title: 'ROT-avdrag',
        content:
          'Vi hanterar ansökan, du får 30% direkt på fakturan',
      },
    ],
    faqs: [
      {
        question: 'Hur lång tid tar en badrumsrenovering?',
        answer:
          'En komplett badrumsrenovering tar vanligtvis 5–10 arbetsdagar beroende på badrummets storlek och omfattningen på arbetet.',
      },
      {
        question: 'Kan vi bo kvar under renoveringen?',
        answer:
          'Ja, men du kommer inte ha tillgång till badrummet under arbetets gång. Vi planerar arbetet så att störningen blir minimal.',
      },
      {
        question: 'Vilka garantier får jag?',
        answer:
          'Vi lämnar 2 års garanti på arbetet. Tätskiktet har 10 års garanti från leverantören.',
      },
      {
        question: 'Hjälper ni med materialval?',
        answer:
          'Absolut. Vi guidar dig genom hela processen — från kakel och klinker till blandare och inredning.',
      },
      {
        question: 'Behövs bygglov för badrumsrenovering?',
        answer:
          'Nej, normalt behövs inget bygglov. Däremot krävs en anmälan till byggnadsnämnden om du ändar VVS-installationer.',
      },
      {
        question: 'Hur fungerar ROT-avdraget?',
        answer:
          'Vi drar av 30% på arbetskostnaden direkt på fakturan. Du betalar bara 70% och vi ansöker om resten från Skatteverket.',
      },
    ],
    stats: {
      duration: '5–10 dagar',
      durationValue: '7',
      response: '24h',
      responseValue: '24',
      warranty: '2 år garanti',
      warrantyValue: '2',
    },
  },

  nybyggnation: {
    pattern: 'timeline',
    timelineSteps: [
      {
        number: '01',
        title: 'Idé & rådgivning',
        description: 'Vi lyssnar på din vision och ger råd',
        icon: 'Lightbulb',
      },
      {
        number: '02',
        title: 'Ritning & bygglov',
        description: 'Vi hanterar ansökan och handlingar',
        icon: 'FileText',
      },
      {
        number: '03',
        title: 'Grund & stomme',
        description: 'Professionell grundläggning och resning',
        icon: 'Building2',
      },
      {
        number: '04',
        title: 'Färdigställning',
        description: 'Invändig finish, besiktning, nyckel i hand',
        icon: 'Key',
      },
    ],
    faqs: [
      {
        question: 'Hur lång tid tar det att bygga ett hus?',
        answer:
          'Det varierar beroende på storlek och komplexitet. En normal villa tar 6–12 månader från bygglov till inflyttning.',
      },
      {
        question: 'Kan ni hjälpa med bygglovsansökan?',
        answer:
          'Ja, vi hanterar hela processen — från ritningar och konstruktionsberäkningar till komplett bygglovsansökan.',
      },
      {
        question: 'Vilka garantier gäller för nybyggnation?',
        answer:
          'Vi lämnar 10 års garanti på nybyggnation enligt konsumenttjänstlagen. Dessutom har du alltid besiktningsgaranti.',
      },
      {
        question: 'Kan jag påverka utformningen?',
        answer:
          'Absolut. Vi arbetar nära dig genom hela processen. Ju tidigare du involveras, desto större påverkan kan du ha.',
      },
      {
        question: 'Vad kostar det att bygga ett hus?',
        answer:
          'Kostnaden beror på många faktorer. Kontakta oss för en första uppskattning baserad på dina önskemål.',
      },
      {
        question: 'Behöver jag vara med och projektleda?',
        answer:
          'Nej, vi tar fullt projektledaransvar. Du får regelbundna uppdateringar och beslutspunkter där din input behövs.',
      },
    ],
    stats: {
      duration: 'Projektberoende',
      durationValue: '180',
      response: '48h',
      responseValue: '48',
      warranty: '10 år garanti',
      warrantyValue: '10',
    },
  },

  ombyggnation: {
    pattern: 'accordion',
    accordionItems: [
      {
        id: 'planlosning',
        icon: 'Layout',
        title: 'Planlösning',
        content:
          'Öppna upp, flytta väggar, skapa nya rum',
      },
      {
        id: 'rivning',
        icon: 'Hammer',
        title: 'Rivning & sanering',
        content:
          'Varsam rivning, sopsortering ingår',
      },
      {
        id: 'ytskikt',
        icon: 'Paintbrush',
        title: 'Ytskikt & finish',
        content:
          'Golv, väggar, tak — komplett ytskikt',
      },
      {
        id: 'elvvs',
        icon: 'Zap',
        title: 'El & VVS',
        content:
          'Koordinering med certifierade underentreprenörer',
      },
      {
        id: 'nyckelklart',
        icon: 'Key',
        title: 'Nyckelklart',
        content:
          'Du får ett färdigt hem, inte ett pågående projekt',
      },
    ],
    faqs: [
      {
        question: 'Hur lång tid tar en ombyggnation?',
        answer:
          'Det beror på omfattningen. En köksrenovering kan ta 2–3 veckor, medan en större ombyggnation kan ta 3–14 dagar eller mer.',
      },
      {
        question: 'Kan vi bo kvar under ombyggnationen?',
        answer:
          'Det beror på projektet. För större ombyggnationer kan det vara praktiskt att bo tillfälligt någon annanstans.',
      },
      {
        question: 'Behövs bygglov för ombyggnation?',
        answer:
          'Det beror på vad du ska göra. Bärande väggar och fasadändringar kräver bygglov. Vi hjälper dig att reda ut vad som gäller.',
      },
      {
        question: 'Vilka garantier får jag?',
        answer:
          'Vi lämnar 5 års garanti på ombyggnationsarbete. Alla underentreprenörer har egna garantier som vi koordinerar.',
      },
      {
        question: 'Kan ni hjälpa med köksbyte?',
        answer:
          'Ja, köksrenovering är en av våra specialiteter. Vi hanterar allt från rivning och el till montering och finish.',
      },
      {
        question: 'Hur fungerar ROT-avdraget vid ombyggnation?',
        answer:
          'ROT-avdrag gäller för de flesta ombyggnationsarbeten. Vi drar av 30% på arbetskostnaden direkt på fakturan.',
      },
    ],
    stats: {
      duration: '3–14 dagar',
      durationValue: '8',
      response: '24h',
      responseValue: '24',
      warranty: '5 år garanti',
      warrantyValue: '5',
    },
  },

  snickeriarbeten: {
    pattern: 'accordion',
    accordionItems: [
      {
        id: 'trappor',
        icon: 'ArrowUp',
        title: 'Trappor',
        content:
          'Skräddarsydda trappor i valfritt material',
      },
      {
        id: 'garderober',
        icon: 'DoorOpen',
        title: 'Garderober',
        content:
          'Inbyggda garderober från golv till tak',
      },
      {
        id: 'forvaring',
        icon: 'Boxes',
        title: 'Förvaringslösningar',
        content:
          'Smarta lösningar för hall, kök, sovrum',
      },
      {
        id: 'mobler',
        icon: 'Sofa',
        title: 'Specialmöbler',
        content:
          'Designade möbler anpassade för ditt hem',
      },
      {
        id: 'mattanpassat',
        icon: 'Ruler',
        title: 'Måttanpassat',
        content:
          'Varje millimeter räknas, alltid perfekt passform',
      },
    ],
    faqs: [
      {
        question: 'Hur lång tid tar snickeriarbeten?',
        answer:
          'Det varierar beroende på projekt. En inbyggd garderob kan ta 2–3 dagar, medan en specialtillverkad trappa kan ta 1–2 veckor.',
      },
      {
        question: 'Vilka material kan jag välja mellan?',
        answer:
          'Vi arbetar med de flesta träslag — ek, björk, furu, valnöt, och mer. Vi hjälper dig välja rätt material för ditt projekt.',
      },
      {
        question: 'Kan ni matcha befintlig inredning?',
        answer:
          'Absolut. Vi tar prover på befintliga ytor och matchar färg, struktur och finish så att det nya smälter in perfekt.',
      },
      {
        question: 'Gäller ROT-avdrag för snickeriarbeten?',
        answer:
          'Ja, ROT-avdrag gäller för inomhusarbete. Vi drar av 30% på arbetskostnaden direkt på fakturan.',
      },
      {
        question: 'Vilka garantier får jag?',
        answer:
          'Vi lämnar 3 års garanti på alla snickeriarbeten. Det täcker materialfel och konstruktionsproblem.',
      },
      {
        question: 'Kan ni rita upp förslag innan vi bestämmer oss?',
        answer:
          'Ja, vi skapar alltid skisser och 3D-visualiseringar så att du kan se resultatet innan vi börjar.',
      },
    ],
    stats: {
      duration: '2–7 dagar',
      durationValue: '4',
      response: '24h',
      responseValue: '24',
      warranty: '3 år garanti',
      warrantyValue: '3',
    },
  },
}

export const relatedServicesMap: Record<string, string[]> = {
  takbyten: ['badrumsrenovering', 'nybyggnation'],
  badrumsrenovering: ['ombyggnation', 'snickeriarbeten'],
  nybyggnation: ['takbyten', 'ombyggnation'],
  ombyggnation: ['badrumsrenovering', 'snickeriarbeten'],
  snickeriarbeten: ['ombyggnation', 'badrumsrenovering'],
}
