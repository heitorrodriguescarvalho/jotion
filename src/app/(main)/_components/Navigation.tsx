'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useMediaQuery } from 'usehooks-ts'
import { useMutation } from 'convex/react'
import { useSearch } from '@/hooks/useSearch'
import { useSettings } from '@/hooks/useSettings'

import { api } from '@/../convex/_generated/api'

import { cn } from '@/lib/utils'

import Item from './Item'
import UserItem from './UserItem'
import DocumentList from './DocumentList'
import TrashBox from './TrashBox'

import { toast } from 'sonner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from 'lucide-react'
import Navbar from './Navbar'

export default function Navigation() {
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const create = useMutation(api.documents.create)
  const search = useSearch()
  const settings = useSettings()

  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<React.ElementRef<'aside'>>(null)
  const navbarRef = useRef<React.ElementRef<'div'>>(null)

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWidth()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
  }, [pathname, isMobile])

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return

    let newWidth = event.clientX

    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.setProperty('left', `${newWidth}px`)
      navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
    }
  }

  const handleMouseUp = () => {
    isResizingRef.current = false

    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    isResizingRef.current = true

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const resetWidth = () => {
    if (!(sidebarRef.current && navbarRef.current)) return

    setIsCollapsed(false)
    setIsResetting(true)

    sidebarRef.current.style.width = isMobile ? '100%' : '240px'
    navbarRef.current.style.setProperty(
      'width',
      isMobile ? '0' : 'calc(100% - 240px)',
    )
    navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px')

    setTimeout(() => setIsResetting(false), 300)
  }

  const collapse = () => {
    if (!(sidebarRef.current && navbarRef.current)) return

    setIsCollapsed(true)
    setIsResetting(true)

    sidebarRef.current.style.width = '0'
    navbarRef.current.style.setProperty('width', '100%')
    navbarRef.current.style.setProperty('left', '0')

    setTimeout(() => setIsResetting(false), 300)
  }

  const handleCreate = () => {
    const promise = create({ title: 'Untitled' }).then((documentId) => {
      router.push(`/documents/${documentId}`)
    })

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.',
    })
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar relative z-[99999] flex h-full w-60 flex-col overflow-y-auto bg-secondary',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'w-0',
        )}
      >
        <div
          role="button"
          className={cn(
            'absolute right-3 top-[10px] size-6 rounded-sm bg-secondary text-muted-foreground opacity-0 transition group-hover/sidebar:opacity-100 dark:hover:bg-neutral-600',
            isMobile && 'opacity-100',
          )}
          onClick={collapse}
        >
          <ChevronsLeft className="size-6" />
        </div>
        <div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={search.onOpen} />
          <Item label="Settings" icon={Settings} onClick={settings.onOpen} />
          <Item onClick={handleCreate} label="New page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item icon={Plus} label="Add a page" onClick={handleCreate} />
          <Popover>
            <PopoverTrigger className="mt-4 w-full">
              <Item label="trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? 'bottom' : 'right'}
              className="w-72 p-0"
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          'absolute left-60 top-0 z-[99999] w-[calc(100%-15rem)]',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'left-0 w-full',
        )}
      >
        {params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="w-full bg-transparent px-3 py-2">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                className="size-6 cursor-pointer text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  )
}
