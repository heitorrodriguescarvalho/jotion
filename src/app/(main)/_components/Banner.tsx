'use client'

import { Id } from '@/../convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { api } from '@/../convex/_generated/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/modals/ConfirmModal'

interface BannerProps {
  documentId: Id<'documents'>
}

export default function Banner({ documentId }: BannerProps) {
  const router = useRouter()
  const remove = useMutation(api.documents.remove)
  const restore = useMutation(api.documents.restore)

  const handleRemove = () => {
    const promise = remove({ id: documentId })

    toast.promise(promise, {
      loading: 'Deleting note...',
      success: 'Note deleted!',
      error: 'Failed to delete note.',
    })

    router.push('/documents')
  }

  const handleRestore = () => {
    const promise = restore({ id: documentId })

    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Note restored!',
      error: 'Failed to restore note.',
    })
  }

  return (
    <div className="flex w-full items-center justify-center gap-x-2 bg-rose-600 p-2 text-center text-sm text-white">
      <p>This page is in the Trash!</p>
      <Button
        size="sm"
        onClick={handleRestore}
        variant="outline"
        className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5 hover:text-white"
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={handleRemove}>
        <Button
          size="sm"
          variant="outline"
          className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5 hover:text-white"
        >
          Delete permanently
        </Button>
      </ConfirmModal>
    </div>
  )
}
