'use client'

import { Accordion } from '@/components/ui/Accordion'
import { cn } from '@/lib/utils'
import { FAQItem } from '@/lib/service-data'

interface ServiceFAQProps {
  faqs: FAQItem[]
  className?: string
}

export function ServiceFAQ({ faqs, className }: ServiceFAQProps) {
  return (
    <div className={cn('bg-[#080d12] py-16 md:py-20', className)}>
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-[#e8e4dc] mb-3">
            Vanliga frågor
          </h2>
          <p className="text-[#c8bfa8] text-base max-w-xl mx-auto">
            Svar på de vanligaste frågorna om våra tjänster
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-[860px] mx-auto">
          <Accordion
            items={faqs.map((faq, index) => ({
              id: `faq-${index}`,
              title: faq.question,
              content: faq.answer,
            }))}
            variant="faq"
          />
        </div>
      </div>
    </div>
  )
}
