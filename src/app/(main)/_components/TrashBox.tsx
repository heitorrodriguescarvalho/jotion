'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Id } from '@/../convex/_generated/dataModel'
import { toast } from 'sonner'
import Spinner from '@/components/Spinner'
import { Search, Trash, Undo } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ConfirmModal from '@/components/modals/ConfirmModal'

export default function TrashBox() {
  const router = useRouter()
  const params = useParams()
  const documents = useQuery(api.documents.getTrash)
  const restore = useMutation(api.documents.restore)
  const remove = useMutation(api.documents.remove)
  const clearTrash = useMutation(api.documents.clearTrash)

  const [search, setSearch] = useState('')

  const filteredDocuments = documents?.filter((document) =>
    document.title.toLowerCase().includes(search.toLowerCase()),
  )

  const handleClick = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  const handleRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<'documents'>,
  ) => {
    event.stopPropagation()
    const promise = restore({ id: documentId })

    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Note restored!',
      error: 'Failed to restore note.',
    })
  }

  const handleRemove = (documentId: Id<'documents'>) => {
    const promise = remove({ id: documentId })

    toast.promise(promise, {
      loading: 'Deleting note...',
      success: 'Note deleted!',
      error: 'Failed to delete note.',
    })

    if (params.documentId === documentId) {
      router.push('/documents')
    }
  }

  const handleClear = () => {
    const promise = clearTrash()

    toast.promise(promise, {
      loading: 'Cleaning trash...',
      success: 'Trash cleaned!',
      error: 'Failed to clean trash.',
    })

    if (
      documents
        ?.map((document) => document._id)
        .includes(params.documentId as Id<'documents'>)
    ) {
      router.push('/documents')
    }
  }

  if (documents === undefined) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-2 p-2">
        <Search className="size-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 bg-secondary px-2 focus-visible:ring-transparent"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 max-h-[220px] overflow-y-scroll px-1 pb-1">
        <p className="hidden pb-2 text-center text-xs text-muted-foreground last:block">
          No Documents Found
        </p>
        {filteredDocuments?.map(({ _id, title }) => (
          <div
            key={_id}
            role="button"
            onClick={() => handleClick(_id)}
            className="flex w-full items-center justify-between rounded-sm px-2 py-1 text-sm text-primary hover:bg-primary/5"
          >
            <span className="truncate">{title}</span>
            <div className="flex items-center gap-x-1">
              <div
                onClick={(e) => handleRestore(e, _id)}
                role="button"
                className="rounded-sm p-1 hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <Undo className="size-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => handleRemove(_id)}>
                <div
                  role="button"
                  className="rounded-sm p-1 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                  <Trash className="size-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
      {documents.length > 0 && (
        <div className="flex w-full items-center justify-end p-2">
          <ConfirmModal onConfirm={handleClear}>
            <div
              role="button"
              className="rounded-sm p-1 text-muted-foreground hover:text-white"
            >
              Clear all
            </div>
          </ConfirmModal>
        </div>
      )}
    </div>
  )
}
