'use client'

import { Id } from '@/../convex/_generated/dataModel'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { api } from '@/../convex/_generated/api'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface MenuProps {
  documentId: Id<'documents'>
}

export default function Menu({ documentId }: MenuProps) {
  const router = useRouter()
  const { user } = useUser()
  const archive = useMutation(api.documents.archive)

  const handleArchive = () => {
    const promise = archive({ id: documentId })

    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note moved to trash!',
      error: 'Failed to archive note.',
    })

    router.push('/documents')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={handleArchive}>
          <Trash className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-2 text-xs text-muted-foreground">
          Last edited by: {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="size-10" />
}
