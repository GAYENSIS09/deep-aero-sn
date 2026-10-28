import { notFound } from 'next/navigation'
import { chapters, getChapter } from '@/lib/chapters'
import { getChapterContent } from '@/lib/chapters-content'
import ChapterLayout from '@/components/ChapterLayout'
import { Section, SubSection } from '@/components/chapter/Section'
import { MathBlock, MathInline } from '@/components/Math'
import { Table, Th, Td, Tr } from '@/components/Table'
import Figure from '@/components/chapter/Figure'
import Callout from '@/components/Callout'
import { renderInlineNodes, renderParagraphs } from '@/lib/inline-render'

interface ChapterPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return chapters.map((chapter) => ({ slug: chapter.slug }))
}

function isGroupRow(row: unknown): row is { group: string } {
  return typeof row === 'object' && row !== null && !Array.isArray(row)
}

function renderTableBlock(block: any): React.ReactNode {
  const headers: Array<string | string[]> = block.headers ?? []
  const subHeaders: string[][] = block.subHeaders ?? []
  const rows: any[] = block.rows ?? []

  const headerRow = (cells: Array<string | string[]>, level: number) => (
    <tr key={`h${level}`}>
      {cells.map((h, i) => (
        <Th key={i}>{renderInlineNodes(typeof h === 'string' ? h : (h[level] ?? ''))}</Th>
      ))}
    </tr>
  )

  return (
    <Table caption={block.caption ? renderInlineNodes(block.caption) : undefined}>
      <thead>
        {headers.some((h) => Array.isArray(h))
          ? [0, 1].map((level) => headerRow(headers as string[][], level))
          : headerRow(headers as string[], 0)}
        {subHeaders.map((cells, i) => (
          <tr key={`sh${i}`}>
            {cells.map((h, j) => (
              <Th key={j}>{renderInlineNodes(h)}</Th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.map((row, ri) => {
          if (isGroupRow(row)) {
            return (
              <tr key={ri} className="bg-db-surface/70">
                <Td className="font-medium text-db-text" colSpan={headers.length}>
                  {renderInlineNodes(row.group)}
                </Td>
              </tr>
            )
          }
          return (
            <Tr key={ri}>
              {(row as string[]).map((cell, ci) => (
                <Td key={ci}>{renderInlineNodes(cell)}</Td>
              ))}
            </Tr>
          )
        })}
      </tbody>
    </Table>
  )
}

function renderBlock(block: any, key: number | string): React.ReactNode {
  switch (block.type) {
    case 'text':
      return <div key={key} className="mb-4">{renderParagraphs(block.content || '')}</div>
    case 'math':
      return block.display ? (
        <MathBlock key={key} tex={block.tex || ''} />
      ) : (
        <MathInline key={key} tex={block.tex || ''} />
      )
    case 'figure':
      return (
        <Figure
          key={key}
          src={block.src}
          caption={renderInlineNodes(block.caption || '')}
          heightClass={block.heightClass}
        />
      )
    case 'table':
      return renderTableBlock(block)
    case 'callout':
      return (
        <Callout key={key} type={(block.variant || 'intuition') as any}>
          {renderParagraphs(block.content || '')}
        </Callout>
      )
    case 'list':
      return (
        <ul key={key} className="list-disc pl-6 space-y-1 mb-4 text-db-text">
          {(block.items || []).map((item: string, i: number) => (
            <li key={i}>{renderInlineNodes(item)}</li>
          ))}
        </ul>
      )
    case 'subsection':
      return (
        <SubSection key={key} title={block.title}>
          {(block.blocks || []).map((subBlock: any, i: number) => renderBlock(subBlock, `${key}-${i}`))}
        </SubSection>
      )
    case 'section':
      return (
        <Section key={key} title={block.title}>
          {(block.blocks || []).map((subBlock: any, i: number) => renderBlock(subBlock, `${key}-${i}`))}
        </Section>
      )
    default:
      return null
  }
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const chapter = getChapter(params.slug)
  const content = getChapterContent(params.slug)

  if (!chapter || !content) {
    notFound()
  }

  return (
    <ChapterLayout
      part={chapter.part}
      chapterNum={chapter.num ?? 0}
      title={chapter.title}
      showHeader={true}
    >
      <div className="mb-8 leading-relaxed text-db-text">
        {renderParagraphs(content.intro)}
      </div>
      {content.sections.map((block: any, i: number) => renderBlock(block, i))}
    </ChapterLayout>
  )
}
