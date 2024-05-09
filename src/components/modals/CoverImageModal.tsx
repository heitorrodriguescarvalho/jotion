'use client'

import { useCoverImage } from '@/hooks/useCoverImage'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useState } from 'react'
import { useEdgeStore } from '@/lib/edgestore'
import { useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { useParams } from 'next/navigation'
import { Id } from '@/../convex/_generated/dataModel'
import { SingleImageDropzone } from '../SingleImageDropzone'

export default function CoverImageModal() {
  const params = useParams()
  const { isOpen, onClose } = useCoverImage()
  const { edgestore } = useEdgeStore()
  const update = useMutation(api.documents.update)
  const coverImage = useCoverImage()

  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    onClose()
  }

  const handleChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true)
      setFile(file)

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url,
        },
      })

      await update({
        id: params.documentId as Id<'documents'>,
        coverImage: res.url,
      })

      handleClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cover Image</DialogTitle>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={handleChange}
        />
      </DialogContent>
    </Dialog>
  )
}
