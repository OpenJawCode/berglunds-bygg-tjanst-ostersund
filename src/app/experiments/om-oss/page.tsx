import { Metadata } from 'next'
import OmOssExperiment from '@/experiments/pages/om-oss-test'

export const metadata: Metadata = {
  title: 'Om oss (Test) | Berglunds Byggtjänst Östersund',
  description: 'Test page for background experiments',
}

export default function Page() {
  return <OmOssExperiment />
}