'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Phone, Home, Bath, Building2, Hammer, Trees, ArrowRight } from 'lucide-react'
import { siteConfig, services } from '@/lib/constants'
import { cn } from '@/lib/utils'
import gsap from 'gsap'

const serviceIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  takbyten: Home,
  badrumsrenovering: Bath,
  nybyggnation: Building2,
  ombyggnation: Hammer,
  snickeriarbeten: Trees,
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
  onMouseEnter?: () => void
}

function NavLink({ href, children, onMouseEnter }: NavLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const link = linkRef.current
    if (!link || !pathRef.current) return

    const handleMouseEnter = () => {
      gsap.to(pathRef.current, {
        attr: { d: 'M 0,4 Q 50,0 100,4' },
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(pathRef.current, {
        attr: { d: 'M 0,4 Q 50,4 100,4' },
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    link.addEventListener('mouseenter', handleMouseEnter)
    link.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      link.removeEventListener('mouseenter', handleMouseEnter)
      link.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <Link
      ref={linkRef}
      href={href}
      onMouseEnter={onMouseEnter}
      className="nav-link relative group flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-text-muted hover:text-primary transition-all duration-200"
      style={{ letterSpacing: '0.06em' }}
    >
      {children}
      <svg
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[60px] h-2 pointer-events-none"
        viewBox="0 0 100 8"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M 0,4 Q 50,4 100,4"
          stroke="#00B8D4"
          strokeWidth="1.5"
          fill="none"
          opacity={0}
        />
      </svg>
    </Link>
  )
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Hem', href: '/' },
    { name: 'Tjänster', href: '/tjanster/', hasDropdown: true },
    { name: 'Referenser', href: '/referenser/' },
    { name: 'Om oss', href: '/om-oss/' },
    { name: 'ROT-avdrag', href: '/rot-avdrag/' },
  ]

  return (
    <>
      {/* Desktop Navigation - Floating Pill */}
      <header
        ref={navRef}
        className={cn(
          'fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block',
          'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'min-w-[640px]'
        )}
      >
        <nav
          className={cn(
            'flex items-center justify-between px-7 py-3 rounded-full',
            'bg-white/[0.07] backdrop-blur-xl border border-white/[0.15]',
            'shadow-lg shadow-black/5',
            'transition-all duration-500',
            isScrolled && 'bg-white/[0.15] shadow-xl shadow-black/10'
          )}
          style={{
            padding: isScrolled ? '8px 20px' : '12px 28px',
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div
              className="transition-all duration-300 overflow-hidden"
              style={{ width: isScrolled ? '32px' : 'auto', height: '28px' }}
            >
              {isScrolled ? (
                <span className="font-heading text-xl font-bold text-primary">B</span>
              ) : (
                <span className="font-heading text-lg font-bold text-primary">
                  BERGLUNDS
                </span>
              )}
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <button
                      className={cn(
                        'flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium',
                        'text-text-muted hover:text-primary transition-colors duration-200'
                      )}
                      style={{ fontSize: isScrolled ? '11px' : '12px' }}
                    >
                      {item.name}
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          isServicesOpen && 'rotate-180'
                        )}
                      />
                    </button>

                    {/* Services Dropdown */}
                    {isServicesOpen && (
                      <div className="absolute top-full left-0 pt-2 animate-fade-in">
                        <div
                          className={cn(
                            'bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-border',
                            'min-w-[240px]'
                          )}
                        >
                          {services.map((service) => {
                            const Icon = serviceIcons[service.slug] || Home
                            return (
                              <Link
                                key={service.slug}
                                href={`/tjanster/${service.slug}/`}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-text hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                              >
                                <Icon className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:scale-110 transition-all duration-200" />
                                <span>{service.title}</span>
                                <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 -rotate-45 group-hover:rotate-0" />
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink href={item.href}>{item.name}</NavLink>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button with gradient shimmer */}
          <Link
            ref={ctaRef}
            href={siteConfig.cta.href}
            className={cn(
              'nav-cta flex items-center gap-2 px-5 py-2.5 ml-2 rounded-full',
              'text-white text-sm font-semibold',
              'transition-all duration-300',
              'hover:shadow-lg hover:shadow-primary/25',
              'active:scale-[0.97]'
            )}
            style={{
              background: 'linear-gradient(90deg, #0096AD 0%, #00B8D4 50%, #0096AD 100%)',
              backgroundSize: '200% 100%',
            }}
          >
            <Phone className="w-4 h-4" />
            {siteConfig.cta.text}
          </Link>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div
          className={cn(
            'mx-4 mt-4 px-4 py-3 rounded-2xl',
            'bg-[#0D1117]/90 backdrop-blur-xl border border-white/[0.15] shadow-lg',
            'flex items-center justify-between',
            'transition-all duration-300',
            isScrolled && 'bg-[#0D1117]/95 shadow-xl'
          )}
        >
          <Link href="/" className="font-heading font-bold text-primary text-lg">
            BERGLUNDS
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
            style={{ width: '44px', height: '44px' }}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div
            className={cn(
              'fixed inset-0 top-20 mx-4 mt-2 rounded-3xl',
              'bg-[#0D1117]/97 backdrop-blur-2xl shadow-2xl',
              'flex flex-col p-6',
              'animate-fade-in'
            )}
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-lg font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200',
                    'animate-fade-up'
                  )}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto">
              <Link
                href={siteConfig.cta.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl',
                  'bg-primary text-white font-semibold',
                  'hover:bg-primary-light transition-colors',
                  'animate-fade-up'
                )}
                style={{ animationDelay: '250ms' }}
              >
                <Phone className="w-5 h-5" />
                {siteConfig.cta.text}
              </Link>

              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 mt-3 text-primary font-medium"
              >
                <Phone className="w-4 h-4" />
                {siteConfig.phone}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
