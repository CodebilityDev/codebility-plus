import React,{ ReactNode } from "react"
import { NodeProps } from "reactflow"
import { ModalType } from "@/hooks/use-modal"

import { User } from "@/types/index"

type ai_ProcessCardT = { id: string; title: string; process: string[] }

type ai_NodeTypesT = NodeProps<{ id: string; title: string; process: string[] }>

type codevs_AboutCardT = {
  icon: string
  title: string
  desc: string
}

type codevs_FeaturedProjectCardT = {
  name: string
  image: string
  logo: string
  desc: string
  link?: string
}

type codevs_ServiceCardT = {
  icon: any
  title: string
  desc: string
}

type codevs_WhyChooseItemT = {
  title: string
  subTitle: string
  itemNumber: number
  description: string
  color?: string
}

type index_AdminCardT = {
  admin: User
  color: string
}

type index_FeatureCardT = {
  imageName: StaticImageData | string
  imageAlt: string
  title: string
  description: string
}
type index_HeroCardT = {
  title?: string
  description?: string
  url?: string
}

type index_MarketingCardT = {
  title?: string
  description?: string
  className?: string
}

type index_ServiceCardT = {
  imageUrl: StaticImageData | string
  imageAlt: string
  title: string
  description: string
  className?: string
}

type profiles_ProfieCardT = {
  user: User
  color: string
}

type profiles_ListFilterT = {
  selectedPosition: string
  setSelectedPosition: React.Dispatch<React.SetStateAction<string>>
  users: User[]
}


type services_ServiceCardT = {
  id?: string
  projectName: string
  description?: string
  projectImage?: StaticImageData | string
  projectType?: string
}


type home_SectionT = {
  children: ReactNode
  className?: string
  id?: string
}

type featured_CardT = {
  title?: string
  description?: string
  url?: string
  src: string
  alt: string
}

type footer_CompanyModalT = {
  id: string
  title: string
  href: ModalType
}

type footer_AboutUsLinksT = {
  id: string
  title: string
  href: string
}

type footer_ConnectUsSocialsT = {
  id: string
  href: string
  icon: any
}

type roadmap_StepsT = {
  id: string
  step: string
}

type roadmap_CardT = {
  id: string
  phase: string
  title: string
  steps: roadmap_StepsT[]
}
