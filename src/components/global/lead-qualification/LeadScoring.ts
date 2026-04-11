import { formatPhoneToE164, isValidSwedishPhone } from '@/lib/phone-utils'

export interface LeadData {
  name: string
  email: string
  phone: string
  postal_code: string
  services: string[]
  description: string
  budget?: string
  timeline?: string
  isPropertyOwner?: boolean
  hasImages?: boolean
}

export interface LeadScore {
  total: number
  breakdown: {
    phone: number
    validPhone: number
    budget: number
    timeline: number
    propertyOwner: number
    images: number
  }
  category: 'HOT' | 'WARM' | 'COLD' | 'BLOCKED'
}

export function calculateLeadScore(data: LeadData): LeadScore {
  const breakdown = {
    phone: 0,
    validPhone: 0,
    budget: 0,
    timeline: 0,
    propertyOwner: 0,
    images: 0,
  }

  // Phone number provided (+10)
  if (data.phone && data.phone.trim().length > 0) {
    breakdown.phone = 10

    // Valid Swedish phone format (+5)
    if (isValidSwedishPhone(data.phone)) {
      breakdown.validPhone = 5
    }
  }

  // Budget provided (+10)
  if (data.budget && data.budget !== 'vet_ej') {
    breakdown.budget = 10
  }

  // Timeline is urgent (+10)
  // Urgent: 'asap', '1_månad', '2_månader'
  if (data.timeline && ['asap', '1_månad', '2_månader'].includes(data.timeline)) {
    breakdown.timeline = 10
  }

  // Property owner (+10)
  if (data.isPropertyOwner === true) {
    breakdown.propertyOwner = 10
  }

  // Has images (+5)
  if (data.hasImages) {
    breakdown.images = 5
  }

  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0)

  // Category determination
  let category: LeadScore['category']
  if (total >= 25) {
    category = 'HOT'
  } else if (total >= 15) {
    category = 'WARM'
  } else if (total >= 5) {
    category = 'COLD'
  } else {
    category = 'BLOCKED'
  }

  return { total, breakdown, category }
}

export function getCategoryAction(category: LeadScore['category']): {
  title: string
  description: string
  cta: string | null
} {
  switch (category) {
    case 'HOT':
      return {
        title: 'Vi ringer dig nu!',
        description: 'Vår säljare är tillgänglig för ett direkt samtal.',
        cta: 'Ring oss nu: 070-321 88 27',
      }
    case 'WARM':
      return {
        title: 'Vi hör av oss inom 2 minuter',
        description: 'En av våra specialister kontaktar dig personligen.',
        cta: null,
      }
    case 'COLD':
      return {
        title: 'Vi återkommer inom 24 timmar',
        description: 'Vi skickar dig relevant information om ditt projekt.',
        cta: null,
      }
    case 'BLOCKED':
      return {
        title: 'Tack för din förfrågan',
        description: 'Vi kommer att skicka dig mer information framöver.',
        cta: null,
      }
  }
}

export const BUDGET_OPTIONS = [
  { value: 'under_50k', label: 'Under 50 000 kr', description: 'Mindre renoveringar och reparationer' },
  { value: '50k_100k', label: '50 000 - 100 000 kr', description: 'Badrum eller köksrenovering i mindre skala' },
  { value: '100k_200k', label: '100 000 - 200 000 kr', description: 'Större badrums- eller köksrenoveringar' },
  { value: '200k_500k', label: '200 000 - 500 000 kr', description: 'Omfattande renoveringar eller tillbyggnader' },
  { value: 'over_500k', label: 'Över 500 000 kr', description: 'Större nybyggnationer och stora projekt' },
  { value: 'vet_ej', label: 'Vet ej / Behöver rådgivning', description: 'Vi hjälper dig att ta reda på det!' },
]

export const TIMELINE_OPTIONS = [
  { value: 'asap', label: 'Så snart som möjligt', description: 'Akut eller brådskande' },
  { value: '1_månad', label: 'Inom 1 månad', description: 'Planerar snart' },
  { value: '2_månader', label: 'Inom 2 månader', description: 'Inom närmaste tid' },
  { value: '3_månader', label: 'Inom 3 månader', description: 'Har lite tid' },
  { value: '6_månader', label: 'Inom 6 månader', description: 'Längre fram i planeringen' },
  { value: 'vet_ej', label: 'Flexibel / Vet ej', description: 'Vi hittar en lösning!' },
]

export const PROPERTY_OWNER_OPTIONS = [
  { value: 'yes', label: 'Ja, jag äger fastigheten', description: 'Du kan få ROT-avdrag (30% rabatt)' },
  { value: 'no', label: 'Nej, jag hyr', description: 'Vi hjälper dig med lösningar' },
  { value: 'planning', label: 'Jag planerar att köpa', description: 'Vi kan hjälpa med kostnadsuppskattning' },
]