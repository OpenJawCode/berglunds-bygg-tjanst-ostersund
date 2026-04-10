import { Metadata } from 'next'
import KontaktExperiment from '@/experiments/pages/kontakt-test'

export const metadata: Metadata = {
  title: 'Kontakt (Test) | Berglunds Byggtjänst Östersund',
  description: 'Test page for background experiments',
}

export default function Page() {
  return <KontaktExperiment />
}