'use client'

import {
  Droplets,
  Square,
  Grid3X3,
  Wrench,
  CheckCircle,
  Receipt,
  Layout,
  Hammer,
  Paintbrush,
  Zap,
  Key,
  ArrowUp,
  DoorOpen,
  Boxes,
  Sofa,
  Ruler,
  LucideIcon,
} from 'lucide-react'
import { Accordion } from '@/components/ui/Accordion'
import { cn } from '@/lib/utils'
import { AccordionItem as AccordionItemType } from '@/lib/service-data'

const iconMap: Record<string, LucideIcon> = {
  Droplets,
  Square,
  Grid3X3,
  Wrench,
  CheckCircle,
  Receipt,
  Layout,
  Hammer,
  Paintbrush,
  Zap,
  Key,
  ArrowUp,
  DoorOpen,
  Boxes,
  Sofa,
  Ruler,
}

interface ServiceAccordionProps {
  items: AccordionItemType[]
  className?: string
}

export function ServiceAccordion({ items, className }: ServiceAccordionProps) {
  return (
    <div className={cn('bg-[#0d1117] py-20 md:py-28', className)}>
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-[#e8e4dc] mb-4">
            Vad ingår?
          </h2>
          <p className="text-[#c8bfa8] text-lg max-w-2xl mx-auto">
            Kompletta lösningar med fokus på kvalitet och hållbarhet
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-[860px] mx-auto">
          <Accordion
            items={items.map((item) => ({
              id: item.id,
              icon: iconMap[item.icon],
              title: item.title,
              content: item.content,
            }))}
            variant="default"
          />
        </div>
      </div>
    </div>
  )
}
