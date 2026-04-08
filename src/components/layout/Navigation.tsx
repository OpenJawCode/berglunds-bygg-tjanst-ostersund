'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Phone, Home, Bath, Building2, Hammer, Trees } from 'lucide-react'
import { siteConfig, services } from '@/lib/constants'
import { cn } from '@/lib/utils'
import gsap from 'gsap'

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
        'relative px-4 py-2 text-sm font-medium transition-all duration-300',
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
  
  // Check if we're on the homepage - subpages need different nav styling
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // On subpages, force "scrolled" appearance immediately (dark text on white bg)
  // because subpages have light backgrounds
  const navIsScrolled = isHomePage ? isScrolled : true

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
      {/* Desktop Navigation - Floating Pill */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <nav
          className={cn(
            'flex items-center justify-between rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'backdrop-blur-xl border shadow-lg',
            navIsScrolled 
              ? 'px-5 py-2 bg-white/95 border-gray-200/50 shadow-xl' 
              : 'px-7 py-3 bg-white/[0.07] border-white/[0.15] shadow-black/5'
          )}
          style={{ minWidth: navIsScrolled ? '600px' : '680px' }}
        >
          {/* Logo */}
          <Link 
            href="/" 
            className={cn(
              'transition-all duration-300 flex items-center gap-2',
              navIsScrolled ? 'h-8' : 'h-10'
            )}
          >
            <img 
              src="/logo.svg" 
              alt="Berglunds Byggtjänst Östersund"
              className={cn(
                'h-full w-auto transition-all duration-300',
                navIsScrolled ? 'brightness-0' : 'brightness-0 invert'
              )}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span 
              className={cn(
                'font-heading font-bold text-lg tracking-tight',
                navIsScrolled ? 'text-text' : 'text-white'
              )}
            >
              BERGLUNDS
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center">
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
                        'flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-300',
                        navIsScrolled
                          ? 'text-text/70 hover:text-text'
                          : 'text-white/70 hover:text-white',
                        isServicesOpen && (navIsScrolled ? 'text-text' : 'text-white'),
                        isActive('/tjanster/') && (navIsScrolled ? 'text-text' : 'text-white')
                      )}
                      style={{ 
                        letterSpacing: '0.06em',
                        fontSize: navIsScrolled ? '11px' : '12px'
                      }}
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
                    isScrolled={navIsScrolled}
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
              'group relative flex items-center gap-2 px-5 py-2.5 ml-2 rounded-full overflow-hidden',
              'text-white text-sm font-semibold',
              'transition-all duration-300',
              'hover:shadow-lg hover:shadow-brand/25',
              'active:scale-[0.97]',
              navIsScrolled ? 'text-xs' : 'text-sm'
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
            navIsScrolled 
              ? 'bg-white/95 border-gray-200/50 shadow-xl' 
              : 'bg-[#0D1117]/90 border-white/[0.15]'
          )}
        >
          <Link 
            href="/" 
            className="h-8 flex items-center gap-2"
          >
            <img 
              src="/logo.svg" 
              alt="Berglunds Byggtjänst Östersund"
              className={cn(
                'h-full w-auto transition-all duration-300',
                navIsScrolled ? 'brightness-0' : 'brightness-0 invert'
              )}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span 
              className={cn(
                'font-heading font-bold text-base tracking-tight',
                navIsScrolled ? 'text-text' : 'text-white'
              )}
            >
              BERGLUNDS
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'flex items-center justify-center w-11 h-11 rounded-full transition-colors',
              navIsScrolled 
                ? 'hover:bg-gray-100' 
                : 'hover:bg-white/10'
            )}
            aria-label={isOpen ? 'Stäng meny' : 'Öppna meny'}
          >
            {isOpen ? (
              <X className={cn('w-6 h-6', navIsScrolled ? 'text-text' : 'text-white')} />
            ) : (
              <Menu className={cn('w-6 h-6', navIsScrolled ? 'text-text' : 'text-white')} />
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
