'use client'

import { useSettings } from '@/hooks/useSettings'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import { Label } from '../ui/label'
import { ModeToggle } from '../mode-toggle'

export default function SettingsModal() {
  const { isOpen, onClose } = useSettings()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My Settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className=" flex flex-col gap-y-1 ">
            <Label>Apperence</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Jotion looks on your device.
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}
