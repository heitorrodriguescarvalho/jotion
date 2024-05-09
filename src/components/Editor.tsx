'use client'

import { PartialBlock } from '@blocknote/core'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { useTheme } from 'next-themes'
import { useEdgeStore } from '@/lib/edgestore'

interface EditorProps {
  onChange: (value: string) => void
  initialContent?: string
  editable?: boolean
}

export default function Editor({
  onChange,
  initialContent,
  editable,
}: EditorProps) {
  const { resolvedTheme } = useTheme()
  const { edgestore } = useEdgeStore()

  const handleChange = () => {
    onChange(JSON.stringify(editor.document))
  }

  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({ file })

    return res.url
  }

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  })

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        editable={editable}
        onChange={handleChange}
      />
    </div>
  )
}
