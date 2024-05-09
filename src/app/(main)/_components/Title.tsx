'use client'

import { api } from '@/../convex/_generated/api'
import { Doc } from '@/../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useMutation } from 'convex/react'
import { useEffect, useRef, useState } from 'react'

interface TitleProps {
  initialData: Doc<'documents'>
}

export default function Title({ initialData }: TitleProps) {
  const update = useMutation(api.documents.update)

  const inputRef = useRef<HTMLInputElement>(null)

  console.log(initialData.title)

  const [title, setTitle] = useState(initialData.title || 'Untitled')
  const [isEditing, setIsEditing] = useState(false)

  const enableInput = () => {
    setTitle(initialData.title)
    setIsEditing(true)
  }

  const disableInput = () => {
    setIsEditing(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    update({
      id: initialData._id,
      title: event.target.value || 'Untitled',
    })
  }

  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      disableInput()
    }
  }

  useEffect(() => {
    if (!isEditing) {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
    }
  }, [isEditing])

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={handleChange}
          onKeyDown={handleKeydown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="h-auto p-1 font-normal"
        >
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-4 w-20 rounded-md" />
}
