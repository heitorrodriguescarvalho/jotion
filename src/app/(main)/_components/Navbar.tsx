'use client'

import { api } from '@/../convex/_generated/api'
import { useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import Title from './Title'
import Banner from './Banner'
import Menu from './Menu'
import { MenuIcon } from 'lucide-react'
import { Id } from '@/../convex/_generated/dataModel'
import Publish from './Publish'

interface NavbarProps {
  isCollapsed: boolean
  onResetWidth: () => void
}

export default function Navbar({ isCollapsed, onResetWidth }: NavbarProps) {
  const { documentId } = useParams()
  const document = useQuery(api.documents.getById, {
    documentId: documentId as Id<'documents'>,
  })

  if (document === undefined) {
    return (
      <nav className="flex w-full items-center justify-between gap-x-4 bg-background px-3 py-2 dark:bg-[#1f1f1f]">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    )
  }

  if (document === null) {
    return null
  }

  return (
    <>
      <nav className="flex w-full items-center gap-x-4 bg-background px-3 py-2 dark:bg-[#1f1f1f]">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="size-6 text-muted-foreground"
          />
        )}
        <div className="flex w-full items-center justify-between">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  )
}
