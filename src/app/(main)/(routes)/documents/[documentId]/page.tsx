'use client'

import { Id } from '@/../convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import Toolbar from '@/components/Toolbar'
import Cover from '@/components/Cover'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

interface DocumentIdPageProps {
  params: {
    documentId: Id<'documents'>
  }
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const Editor = useMemo(
    () => dynamic(() => import('@/components/Editor'), { ssr: false }),
    [],
  )

  const update = useMutation(api.documents.update)

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  })

  const handleChange = (content: string) => {
    update({ id: params.documentId, content })
  }

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="max-auto mt-10 md:max-w-3xl lg:max-w-4xl">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return <div>Not found</div>
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document} />
        <Editor onChange={handleChange} initialContent={document.content} />
      </div>
    </div>
  )
}
