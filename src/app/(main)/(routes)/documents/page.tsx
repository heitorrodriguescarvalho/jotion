'use client'

import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { api } from '@/../convex/_generated/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function Documents() {
  const { user } = useUser()
  const create = useMutation(api.documents.create)
  const router = useRouter()

  const handleCreate = () => {
    const promise = create({ title: 'Untitled' }).then((documentId) =>
      router.push(`/documents/${documentId}`),
    )

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.',
    })
  }

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height={300}
        width={300}
        alt="empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height={300}
        width={300}
        alt="empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Jotion
      </h2>
      <Button onClick={handleCreate}>
        <PlusCircle className="mr-2 size-4" />
        Create a note
      </Button>
    </div>
  )
}
