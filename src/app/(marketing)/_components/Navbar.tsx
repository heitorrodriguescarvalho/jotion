'use client'

import { useScrollTop } from '@/hooks/useScrollTop'
import { cn } from '@/lib/utils'
import Logo from './Logo'
import { ModeToggle } from '@/components/mode-toggle'
import { useConvexAuth } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/Spinner'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { dark } from '@clerk/themes'

export default function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const scrolled = useScrollTop()
  const { resolvedTheme } = useTheme()

  return (
    <div
      className={cn(
        'fixed top-0 z-50 flex w-full items-center bg-background p-6 dark:bg-[#1f1f1f]',
        scrolled && 'border-b shadow-sm',
      )}
    >
      <Logo />
      <div className="flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end">
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">Get Jotion free</Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">Enter Jotion</Link>
            </Button>
            <UserButton
              afterSignOutUrl="/"
              appearance={
                resolvedTheme === 'dark'
                  ? {
                      baseTheme: dark,
                    }
                  : undefined
              }
            />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  )
}
