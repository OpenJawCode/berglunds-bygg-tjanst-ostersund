'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Phone, Home, Bath, Building2, Hammer, Trees } from 'lucide-react'
import { siteConfig, services } from '@/lib/constants'
import { cn } from '@/lib/utils'
import gsap from 'gsap'

// Subtle glow animation for active nav items - premium construction brand aesthetic
const glowPulseKeyframes = `
@keyframes glow-pulse {
  0%, 100% { 
    filter: drop-shadow(0 0 2px rgba(0, 184, 212, 0.3)) drop-shadow(0 0 4px rgba(0, 184, 212, 0.2));
    opacity: 0.9;
  }
  50% { 
    filter: drop-shadow(0 0 4px rgba(0, 184, 212, 0.4)) drop-shadow(0 0 8px rgba(0, 184, 212, 0.3));
    opacity: 1;
  }
}
`

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  takbyten: Home,
  badrumsrenovering: Bath,
  nybyggnation: Building2,
  ombyggnation: Hammer,
  snickeriarbeten: Trees,
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
  isScrolled: boolean
}

function NavLink({ href, children, isActive, isScrolled }: NavLinkProps) {
  const pathRef = useRef<SVGPathElement>(null)

  const handleMouseEnter = () => {
    if (pathRef.current) {
      gsap.to(pathRef.current, {
        attr: { d: 'M 0,4 Q 50,0 100,4' },
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  const handleMouseLeave = () => {
    if (pathRef.current && !isActive) {
      gsap.to(pathRef.current, {
        attr: { d: 'M 0,4 Q 50,4 100,4' },
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  return (
    <Link
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative px-3 py-2 text-sm font-medium transition-all duration-300 leading-none whitespace-nowrap',
        isScrolled 
          ? 'text-text/70 hover:text-text' 
          : 'text-white/70 hover:text-white',
        isActive && (isScrolled ? 'text-text' : 'text-white')
      )}
      style={{ letterSpacing: '0.06em' }}
    >
      {children}
      <svg
        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-[calc(100%-16px)] h-2 pointer-events-none overflow-visible"
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        style={isActive ? { animation: 'glow-pulse 3s ease-in-out infinite' } : undefined}
      >
        <path
          ref={pathRef}
          d="M 0,4 Q 50,4 100,4"
          stroke="#00B8D4"
          strokeWidth="1.5"
          fill="none"
          opacity={isActive ? 1 : 0}
        />
      </svg>
    </Link>
  )
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const pathname = usePathname()
  const ctaRef = useRef<HTMLAnchorElement>(null)

  // Scroll behavior - consistent across ALL pages
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const navLinks = [
    { name: 'Hem', href: '/' },
    { name: 'Tjänster', href: '/tjanster/', hasDropdown: true },
    { name: 'Referenser', href: '/referenser/' },
    { name: 'Om oss', href: '/om-oss/' },
    { name: 'ROT-avdrag', href: '/rot-avdrag/' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Inject glow animation styles */}
      <style>{glowPulseKeyframes}</style>
      
      {/* Desktop Navigation - Floating Pill */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <nav
          className={cn(
            'flex items-baseline justify-between rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'backdrop-blur-xl border shadow-lg',
            isScrolled 
              ? 'px-5 py-3 bg-white/95 border-gray-200/50 shadow-xl' 
              : 'px-6 py-4 bg-white/[0.07] border-white/[0.15] shadow-black/5'
          )}
          style={{ minWidth: isScrolled ? '840px' : '920px' }}
        >
          {/* Logo - Full logo at top, compact monogram when scrolled */}
          <Link 
            href="/" 
            className="transition-all duration-300 flex-shrink-0"
          >
            <img 
              src={isScrolled ? "/logo-monogram.png" : "/logo-original.png"}
              alt="Berglunds Byggtjänst Östersund"
              className={cn(
                'h-8 w-auto transition-all duration-300 object-contain',
                isScrolled ? 'brightness-0 h-7' : ''
              )}
              style={{ 
                filter: isScrolled ? 'brightness(0)' : 'none',
                maxWidth: isScrolled ? '40px' : '200px'
              }}
            />
          </Link>

          {/* Nav Links - Using items-baseline for proper alignment */}
          <div className="flex items-baseline gap-1">
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
                        'flex items-baseline gap-1 px-3 py-2 text-sm font-medium transition-all duration-300 leading-none whitespace-nowrap',
                        isScrolled
                          ? 'text-text/70 hover:text-text'
                          : 'text-white/70 hover:text-white',
                        isServicesOpen && (isScrolled ? 'text-text' : 'text-white'),
                        isActive('/tjanster/') && (isScrolled ? 'text-text' : 'text-white')
                      )}
                      style={{ letterSpacing: '0.06em' }}
                    >
                      {item.name}
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          isServicesOpen && 'rotate-180'
                        )}
                      />
                    </button>

                    {/* Active underline with glow for Tjänster */}
                    {isActive('/tjanster/') && (
                      <svg
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-[calc(100%-16px)] h-2 pointer-events-none overflow-visible"
                        viewBox="0 0 100 8"
                        preserveAspectRatio="none"
                        style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}
                      >
                        <path
                          d="M 0,4 Q 50,4 100,4"
                          stroke="#00B8D4"
                          strokeWidth="1.5"
                          fill="none"
                        />
                      </svg>
                    )}

                    {/* Services Dropdown */}
                    <div
                      className={cn(
                        'absolute top-full left-0 pt-2 transition-all duration-200',
                        isServicesOpen 
                          ? 'opacity-100 translate-y-0 pointer-events-auto' 
                          : 'opacity-0 -translate-y-2 pointer-events-none'
                      )}
                    >
                      <div
                        className={cn(
                          'bg-[#0D1117]/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/10',
                          'min-w-[260px]'
                        )}
                      >
                        {services.map((service) => {
                          const Icon = serviceIcons[service.slug] || Home
                          const isServiceActive = pathname === `/tjanster/${service.slug}/`
                          
                          return (
                            <Link
                              key={service.slug}
                              href={`/tjanster/${service.slug}/`}
                              className={cn(
                                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group',
                                isServiceActive
                                  ? 'bg-brand/20 text-white'
                                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                              )}
                            >
                              <Icon 
                                className={cn(
                                  'w-4 h-4 transition-all duration-200',
                                  'group-hover:text-brand group-hover:scale-110 group-hover:rotate-[10deg]'
                                )} 
                              />
                              <span className="flex-1">{service.title}</span>
                              <ChevronDown 
                                className={cn(
                                  'w-3 h-3 -rotate-90 transition-all duration-200',
                                  'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                                )} 
                              />
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <NavLink 
                    href={item.href} 
                    isActive={isActive(item.href)}
                    isScrolled={isScrolled}
                  >
                    {item.name}
                  </NavLink>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button with Skill Animation */}
          <Link
            ref={ctaRef}
            href={siteConfig.cta.href}
            className={cn(
              'group relative flex items-center gap-2 px-5 py-2.5 rounded-full overflow-hidden flex-shrink-0',
              'text-white text-sm font-semibold whitespace-nowrap',
              'transition-all duration-300',
              'hover:shadow-lg hover:shadow-brand/25',
              'active:scale-[0.97]'
            )}
            style={{
              background: 'linear-gradient(90deg, #0096AD 0%, #00B8D4 50%, #0096AD 100%)',
              backgroundSize: '200% 100%',
            }}
            onMouseEnter={(e) => {
              // Shimmer effect
              gsap.to(e.currentTarget, {
                backgroundPosition: '100% 0',
                duration: 0.4,
                ease: 'power2.out',
              })
              // Skill/scale effect
              gsap.to(e.currentTarget, {
                scale: 1.05,
                duration: 0.3,
                ease: 'back.out(1.7)',
              })
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                backgroundPosition: '0% 0',
                scale: 1,
                duration: 0.4,
                ease: 'power2.out',
              })
            }}
          >
            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Phone className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{siteConfig.cta.text}</span>
          </Link>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div
          className={cn(
            'mx-4 mt-4 px-4 py-3 rounded-2xl transition-all duration-300',
            'backdrop-blur-xl border shadow-lg',
            'flex items-center justify-between',
            isScrolled 
              ? 'bg-white/95 border-gray-200/50 shadow-xl' 
              : 'bg-[#0D1117]/90 border-white/[0.15]'
          )}
        >
          <Link 
            href="/" 
            className="flex-shrink-0"
          >
            <img 
              src={isScrolled ? "/logo-monogram.png" : "/logo-original.png"}
              alt="Berglunds Byggtjänst Östersund"
              className={cn(
                'h-8 w-auto transition-all duration-300 object-contain',
                isScrolled ? 'brightness-0 h-7' : ''
              )}
              style={{ 
                filter: isScrolled ? 'brightness(0)' : 'none',
                maxWidth: isScrolled ? '40px' : '180px'
              }}
            />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'flex items-center justify-center w-11 h-11 rounded-full transition-colors',
              isScrolled 
                ? 'hover:bg-gray-100' 
                : 'hover:bg-white/10'
            )}
            aria-label={isOpen ? 'Stäng meny' : 'Öppna meny'}
          >
            {isOpen ? (
              <X className={cn('w-6 h-6', isScrolled ? 'text-text' : 'text-white')} />
            ) : (
              <Menu className={cn('w-6 h-6', isScrolled ? 'text-text' : 'text-white')} />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={cn(
            'fixed inset-0 top-20 mx-4 mt-2 rounded-3xl overflow-hidden',
            'bg-[#0D1117]/97 backdrop-blur-2xl shadow-2xl',
            'flex flex-col p-6',
            'transition-all duration-300',
            isOpen 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 -translate-y-4 pointer-events-none'
          )}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200',
                  isActive(item.href)
                    ? 'text-white bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.3s ease ${index * 60}ms, transform 0.3s ease ${index * 60}ms`,
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6">
            <Link
              href={siteConfig.cta.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl',
                'bg-brand text-white font-semibold',
                'hover:bg-brand-600 transition-colors',
                'active:scale-[0.98]'
              )}
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.3s ease 300ms, transform 0.3s ease 300ms',
              }}
            >
              <Phone className="w-5 h-5" />
              {siteConfig.cta.text}
            </Link>

            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
              className="flex items-center justify-center gap-2 mt-4 text-brand font-medium"
            >
              <Phone className="w-4 h-4" />
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </header>
    </>
  )
}
