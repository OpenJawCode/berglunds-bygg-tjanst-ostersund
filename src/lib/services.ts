import { 
  Home, 
  Droplets, 
  ChefHat, 
  Building2, 
  Maximize2, 
  Wrench, 
  Hammer, 
  Warehouse,
  HelpCircle
} from 'lucide-react'

export interface ServiceOption {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

export const SERVICE_OPTIONS: ServiceOption[] = [
  { 
    value: 'takbyten', 
    label: 'Takbyten',
    icon: Home,
    description: 'Komplett byte av tak med garanti'
  },
  { 
    value: 'badrumsrenovering', 
    label: 'Badrumsrenovering',
    icon: Droplets,
    description: 'Totalrenovering av badrum'
  },
  { 
    value: 'köksrenovering', 
    label: 'Köksrenovering',
    icon: ChefHat,
    description: 'Nytt kök från planering till färdigt'
  },
  { 
    value: 'nybyggnation', 
    label: 'Nybyggnation',
    icon: Building2,
    description: 'Nybyggnation från grunden'
  },
  { 
    value: 'tillbyggnad', 
    label: 'Tillbyggnad',
    icon: Maximize2,
    description: 'Utöka ditt boende'
  },
  { 
    value: 'ombyggnation', 
    label: 'Ombyggnation',
    icon: Wrench,
    description: 'Förändra planlösning'
  },
  { 
    value: 'snickeri', 
    label: 'Snickeriarbeten',
    icon: Hammer,
    description: 'Specialsnickeri efter mått'
  },
  { 
    value: 'fasad', 
    label: 'Fasadarbeten',
    icon: Warehouse,
    description: 'Målning och reparation'
  },
  { 
    value: 'annat', 
    label: 'Annat',
    icon: HelpCircle,
    description: 'Övriga byggtjänster'
  },
]

export const getServiceByValue = (value: string): ServiceOption | undefined => {
  return SERVICE_OPTIONS.find(opt => opt.value === value)
}

export const getServiceIcon = (value: string) => {
  const service = getServiceByValue(value)
  return service?.icon || HelpCircle
}
