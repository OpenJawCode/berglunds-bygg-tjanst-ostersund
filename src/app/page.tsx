import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import MarqueeLoop from '@/components/sections/MarqueeLoop'
import TrustSignals from '@/components/sections/TrustSignals'
import Services from '@/components/sections/Services'
import RotAvdragCTA from '@/components/sections/RotAvdragCTA'
import ReferencesTeaser from '@/components/sections/ReferencesTeaser'
import AboutTeaser from '@/components/sections/AboutTeaser'
import FinalCTA from '@/components/sections/FinalCTA'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <MarqueeLoop />
        <TrustSignals />
        <Services />
        <RotAvdragCTA />
        <ReferencesTeaser />
        <AboutTeaser />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
