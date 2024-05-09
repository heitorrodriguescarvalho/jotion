'use client'

import { Doc, Id } from '@/../convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/../convex/_generated/api'
import Item from './Item'
import { cn } from '@/lib/utils'
import { FileIcon } from 'lucide-react'

interface DocumentListProps {
  parentDocumentId?: Id<'documents'>
  level?: number
  data?: Doc<'documents'>[]
}

export default function DocumentList({
  parentDocumentId,
  level = 0,
}: DocumentListProps) {
  const params = useParams()
  const router = useRouter()
  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  })

  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const handleExpand = (documentId: string) => {
    setExpanded((prev) => ({ ...prev, [documentId]: !prev[documentId] }))
  }

  const handleRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={0} />
        {level === 0 && (
          <>
            <Item.Skeleton level={0} />
            <Item.Skeleton level={0} />
          </>
        )}
      </>
    )
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 32}px` : undefined }}
        className={cn(
          'hidden p-1 text-sm font-medium text-muted-foreground/80',
          expanded && 'last:block',
          level === 0 && 'hidden',
        )}
      >
        No pages inside
      </p>
      {documents.map(({ _id, title, icon }) => (
        <div key={_id}>
          <Item
            id={_id}
            onClick={() => handleRedirect(_id)}
            label={title}
            icon={FileIcon}
            documentIcon={icon}
            active={params.documentId === _id}
            level={level}
            onExpand={() => handleExpand(_id)}
            expanded={expanded[_id]}
          />
          {expanded[_id] && (
            <DocumentList parentDocumentId={_id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  )
}
