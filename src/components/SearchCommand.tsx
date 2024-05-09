'use client'

import { useUser } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { api } from '@/../convex/_generated/api'
import { useSearch } from '@/hooks/useSearch'
import { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { File } from 'lucide-react'

export default function SearchCommand() {
  const { user } = useUser()
  const router = useRouter()
  const documents = useQuery(api.documents.getSearch)

  const toggle = useSearch((store) => store.toggle)
  const isOpen = useSearch((store) => store.isOpen)
  const onClose = useSearch((store) => store.onClose)

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()

        toggle()
      }
    }

    document.addEventListener('keydown', handleKeydown)

    return () => document.removeEventListener('keydown', handleKeydown)
  }, [toggle])

  const handleSelect = (id: string) => {
    router.push(`/documents/${id}`)

    onClose()
  }

  if (!isMounted) {
    return null
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.fullName}'s Jotion...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map(({ _id, title, icon }) => (
            <CommandItem
              key={_id}
              value={`${_id}-${title}`}
              title={title}
              onSelect={handleSelect}
            >
              {icon ? (
                <p className="mr-2 text-lg">{icon}</p>
              ) : (
                <File className="mr-2 size-4" />
              )}
              <span>{title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
