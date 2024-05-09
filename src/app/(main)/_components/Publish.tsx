'use client'

import { Doc } from '@/../convex/_generated/dataModel'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useOrigin } from '@/hooks/useOrigin'
import { api } from '@/../convex/_generated/api'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Check, Copy, Globe } from 'lucide-react'

interface PublishProps {
  initialData: Doc<'documents'>
}

export default function Publish({ initialData }: PublishProps) {
  const origin = useOrigin()
  const update = useMutation(api.documents.update)

  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const url = `${origin}/preview/${initialData._id}`

  const handlePublish = () => {
    setIsSubmitting(true)

    const promise = update({ id: initialData._id, isPublished: true }).finally(
      () => setIsSubmitting(false),
    )

    toast.promise(promise, {
      loading: 'Publishing...',
      success: 'Note published!',
      error: 'Failed to publish note.',
    })
  }
  const handleUnpublish = () => {
    setIsSubmitting(true)

    const promise = update({ id: initialData._id, isPublished: false }).finally(
      () => setIsSubmitting(false),
    )

    toast.promise(promise, {
      loading: 'Unpublishing...',
      success: 'Note unpublished!',
      error: 'Failed to unpublish note.',
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(url)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publish
          {initialData.isPublished && (
            <Globe className="ml-2 size-4 text-sky-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="size-4 animate-pulse text-sky-500" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={url}
                className="bg-muted-truncate h-8 flex-1 rounded-l-md border px-2 text-xs"
                disabled
              />
              <Button
                onClick={handleCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              disabled={isSubmitting}
              onClick={handleUnpublish}
            >
              Unpublished
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="mb-2 size-8 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">Publish this note</p>
            <span className="mb-4 text-xs text-muted-foreground">
              Share your work with others.
            </span>
            <Button
              disabled={isSubmitting}
              onClick={handlePublish}
              className="w-full text-xs"
              size="sm"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
