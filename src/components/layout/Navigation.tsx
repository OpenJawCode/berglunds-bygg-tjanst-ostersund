'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import { siteConfig, services } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Desktop Navigation - Floating Pill */}
      <header
        className={cn(
          'fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block',
          'transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]'
        )}
      >
        <nav
          className={cn(
            'flex items-center gap-1 px-2 py-2 rounded-full',
            'bg-white/80 backdrop-blur-xl border border-white/20',
            'shadow-lg shadow-black/5',
            'transition-all duration-500',
            isScrolled && 'bg-white/95 shadow-xl shadow-black/10'
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 font-heading font-bold text-primary"
          >
            <span className="text-lg">Berglunds</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {siteConfig.navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.name === 'Tjänster' ? (
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
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    </button>
                    
                    {/* Services Dropdown */}
                    {isServicesOpen && (
                      <div className="absolute top-full left-0 pt-2">
                        <div
                          className={cn(
                            'bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-border',
                            'min-w-[200px] animate-fade-in'
                          )}
                        >
                          {services.map((service) => (
                            <Link
                              key={service.slug}
                              href={`/tjanster/${service.slug}/`}
                              className="block px-4 py-2 rounded-lg text-sm text-text hover:bg-primary/5 hover:text-primary transition-colors"
                            >
                              {service.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium',
                      'text-text-muted hover:text-primary transition-colors duration-200'
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href={siteConfig.cta.href}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 ml-2 rounded-full',
              'bg-primary text-white text-sm font-semibold',
              'hover:bg-primary-light transition-all duration-300',
              'hover:shadow-lg hover:shadow-primary/25',
              'active:scale-[0.98]'
            )}
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
            'bg-white/90 backdrop-blur-xl border border-white/20 shadow-lg',
            'flex items-center justify-between',
            'transition-all duration-300',
            isScrolled && 'bg-white/95 shadow-xl'
          )}
        >
          <Link href="/" className="font-heading font-bold text-primary text-lg">
            Berglunds
          </Link>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-primary/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div
            className={cn(
              'fixed inset-0 top-20 mx-4 mt-2 rounded-3xl',
              'bg-white/95 backdrop-blur-2xl shadow-2xl',
              'flex flex-col p-6 animate-fade-in'
            )}
          >
            <nav className="flex flex-col gap-2">
              {siteConfig.navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-lg font-medium text-text',
                    'hover:bg-primary/5 hover:text-primary transition-all duration-200',
                    'animate-fade-up'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
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
