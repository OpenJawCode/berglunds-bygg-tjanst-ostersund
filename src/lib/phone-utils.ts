// Phone utility for Berglunds Byggtjänst
// Handles Swedish phone number formatting to E.164

/**
 * Formats a Swedish phone number to E.164 format (+46XXXXXXXXX)
 * Accepts various input formats:
 * - 070-123 45 67
 * - 0701234567
 * - +46 70 123 45 67
 * - +46701234567
 */
export function formatPhoneToE164(input: string): string | null {
  const cleaned = input.replace(/[^\d+]/g, '')

  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `+46${cleaned.slice(1)}`
  }

  if (cleaned.startsWith('+46') && cleaned.length === 13) {
    return cleaned
  }

  if (cleaned.startsWith('46') && cleaned.length === 12) {
    return `+${cleaned}`
  }

  if (cleaned.startsWith('+') && cleaned.length === 13) {
    return cleaned
  }

  return null
}

export function isValidSwedishPhone(input: string): boolean {
  const formatted = formatPhoneToE164(input)
  if (!formatted) return false
  return /^\+467[02369]\d{7}$/.test(formatted)
}

export function formatPhoneForDisplay(e164: string): string {
  if (!e164.startsWith('+46') || e164.length !== 13) {
    return e164
  }
  const digits = e164.slice(3)
  return `0${digits[0]}${digits[1]}-${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`
}
