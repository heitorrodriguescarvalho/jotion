'use client'

import { Doc } from '@/../convex/_generated/dataModel'
import IconPicker from './IconPicker'
import { Button } from './ui/button'
import { ImageIcon, Smile, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { api } from '@/../convex/_generated/api'
import TeaxtareaAutosize from 'react-textarea-autosize'
import { useMutation } from 'convex/react'
import { useCoverImage } from '@/hooks/useCoverImage'

interface ToolbarProps {
  initialData: Doc<'documents'>
  preview?: boolean
}

export default function Toolbar({ initialData, preview }: ToolbarProps) {
  const { icon, coverImage, title, _id } = initialData

  const update = useMutation(api.documents.update)
  const removeIcon = useMutation(api.documents.removeIcon)

  const coverImageStore = useCoverImage()

  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(title)

  const inputRef = useRef<React.ElementRef<'textarea'>>(null)

  const enableInput = () => {
    if (preview) return

    setIsEditing(true)
  }

  useEffect(() => {
    if (isEditing) {
      setValue(title)
      inputRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing])

  const disableInput = () => setIsEditing(false)

  const handleInput = (value: string) => {
    setValue(value)
    update({ id: _id, title: value || 'Untitled' })
  }

  const handleKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      disableInput()
    }
  }

  const handleIconSelect = (icon: string) => {
    update({
      id: _id,
      icon,
    })
  }

  const handleRemoveIcon = () => {
    removeIcon({ id: _id })
  }

  return (
    <div className="group relative pl-[54px]">
      {!!icon && !preview && (
        <div className="group/icon flex items-center gap-x-2 pt-6">
          <IconPicker onChange={handleIconSelect}>
            <p className="text-6xl transition hover:opacity-75">{icon}</p>
          </IconPicker>
          <Button
            onClick={handleRemoveIcon}
            className="rounded-full text-xs text-muted-foreground opacity-0 transition group-hover/icon:opacity-100"
            variant="outline"
            size="icon"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
      {!!icon && preview && <p className="pt-6 text-6xl">{icon}</p>}
      <div className="flex items-center gap-x-1 py-4 opacity-0 group-hover:opacity-100">
        {!icon && !preview && (
          <IconPicker asChild onChange={handleIconSelect}>
            <Button
              className="text-xs text-muted-foreground"
              variant="outline"
              size="sm"
            >
              <Smile className="mr-2 size-4" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!coverImage && !preview && (
          <Button
            className="text-xs text-muted-foreground"
            onClick={coverImageStore.onOpen}
            variant="outline"
            size="sm"
          >
            <ImageIcon className="mr-2 size-4" />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TeaxtareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={handleKeydown}
          value={value}
          onChange={(e) => handleInput(e.target.value)}
          className="resize-none break-words bg-transparent text-5xl font-bold text-[#3f3f3f] outline-none dark:text-[#cfcfcf]"
        />
      ) : (
        <div
          onClick={enableInput}
          className="break-words pb-[11.5px] text-5xl font-bold text-[#3f3f3f] outline-none dark:text-[#cfcfcf]"
        >
          {title}
        </div>
      )}
    </div>
  )
}
