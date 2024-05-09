'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Button } from './ui/button'
import { ImageIcon, X } from 'lucide-react'
import { useCoverImage } from '@/hooks/useCoverImage'
import { useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { useParams } from 'next/navigation'
import { Id } from '@/../convex/_generated/dataModel'
import { useEdgeStore } from '@/lib/edgestore'
import { Skeleton } from './ui/skeleton'

interface CoverProps {
  url?: string
  preview?: boolean
}

export default function Cover({ url, preview }: CoverProps) {
  const { onReplace } = useCoverImage()
  const removeCoverImage = useMutation(api.documents.removeCoverImage)
  const params = useParams()
  const { edgestore } = useEdgeStore()

  const handleRemove = async () => {
    if (url)
      await edgestore.publicFiles.delete({
        url,
      })
    removeCoverImage({
      id: params.documentId as Id<'documents'>,
    })
  }

  return (
    <div
      className={cn(
        'group relative h-[35vh] w-full',
        !url && 'h-[12vh]',
        url && 'bg-muted',
      )}
    >
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}
      {!!url && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            onClick={() => onReplace(url)}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="mr-2 size-4" />
            Change cover
          </Button>
          <Button
            onClick={handleRemove}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <X className="mr-2 size-4" />
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="h-[12vh] w-full" />
}
