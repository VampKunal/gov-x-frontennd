"use client"

import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface UserPopoverProps {
    image?: string | null
    name?: string | null
    email?: string | null
    onSignOut: () => void
}

export function UserPopover({ image, name, email, onSignOut }: UserPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 cursor-pointer active:scale-95 hover:scale-105">
          <Avatar className="h-8 w-8">
            <AvatarImage src={image || ""} alt={name || "User"} />
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-green-400 text-white">
              {name?.charAt(0) || email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="flex flex-col space-y-4">
          {/* User Info Section */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={image || ""} alt={name || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-green-400 text-white">
                {name?.charAt(0) || email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              {name && <p className="text-sm font-medium leading-none">{name}</p>}
              {email && <p className="text-xs text-muted-foreground">{email}</p>}
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex flex-col space-y-1">
            <Button variant="ghost" size="sm" className="justify-start" onClick={onSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
