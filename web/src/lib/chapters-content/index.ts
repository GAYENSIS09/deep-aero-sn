import { chapters } from '@/lib/chapters'
import { chapterContent as introContent } from './introduction'
import { chapterContent as ch1Content } from './1-transition'
import { chapterContent as ch2Content } from './2-physique'
import { chapterContent as ch4Content } from './4-fondations'
import { chapterContent as ch5Content } from './5-modeles'
import { chapterContent as ch6Content } from './6-architectures'
import { chapterContent as ch7Content } from './7-strategies'
import { chapterContent as ch8Content } from './8-etudes-cas'

export interface ChapterSection {
  level: 1 | 2 | 3
  title: string
  content: string
  sections?: ChapterSection[]
}

export interface ChapterBlock {
  type: string
  title?: string
  content?: string
  tex?: string
  display?: boolean
  src?: string
  caption?: string
  variant?: string
  items?: string[]
  heightClass?: string
  headers?: Array<string | string[]>
  subHeaders?: string[][]
  rows?: Array<string[] | { group: string }>
  blocks?: ChapterBlock[]
}

export interface ChapterData {
  slug: string
  title: string
  part: string
  intro: string
  sections: ChapterBlock[]
}

const contentMap: Record<string, ChapterData> = {}

contentMap[introContent.slug] = introContent
contentMap[ch1Content.slug] = ch1Content
contentMap[ch2Content.slug] = ch2Content
contentMap[ch4Content.slug] = ch4Content
contentMap[ch5Content.slug] = ch5Content
contentMap[ch6Content.slug] = ch6Content
contentMap[ch7Content.slug] = ch7Content
contentMap[ch8Content.slug] = ch8Content

export function getChapterContent(slug: string): ChapterData | undefined {
  return contentMap[slug]
}

export function getAllChapterContents(): ChapterData[] {
  return chapters.map((c) => contentMap[c.slug]).filter(Boolean) as ChapterData[]
}
