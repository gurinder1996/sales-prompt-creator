"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy, Trash2, RotateCcw, Phone, PhoneOff, Loader2 } from "lucide-react"
import { useState, useCallback } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const baseButtonStyles = "h-8 w-8 p-0 rounded-full border shadow-sm transition-colors bg-white"

interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void
  className?: string
  children: React.ReactNode
  tooltipContent: string
}

function ActionButton({ onClick, className, children, tooltipContent }: ActionButtonProps) {
  const [open, setOpen] = useState(false)
  
  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={`${baseButtonStyles} ${className}`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface CopyButtonProps {
  text: string
  onCopy?: () => void
}

export function CopyButton({ text, onCopy }: CopyButtonProps) {
  const { toast } = useToast()

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Markdown prompt copied to clipboard",
    })
    onCopy?.()
  }, [text, toast, onCopy])

  return (
    <ActionButton
      onClick={handleCopy}
      className="text-muted-foreground hover:text-primary hover:border-primary/50"
      tooltipContent="Copy to clipboard"
    >
      <Copy className="h-4 w-4" />
      <span className="sr-only">Copy to clipboard</span>
    </ActionButton>
  )
}

interface DeleteButtonProps {
  onDelete: () => void
  confirmationMessage?: string
  deleteMessage?: string
}

export function DeleteButton({ 
  onDelete, 
  confirmationMessage = "Click again to confirm",
  deleteMessage = "Delete prompt"
}: DeleteButtonProps) {
  const [confirmation, setConfirmation] = useState(false)
  const { toast } = useToast()

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirmation) {
      onDelete()
      setConfirmation(false)
      toast({
        title: "Deleted",
        description: "Prompt removed",
      })
    } else {
      setConfirmation(true)
      setTimeout(() => {
        setConfirmation(false)
      }, 3000)
    }
  }, [confirmation, onDelete, toast])

  return (
    <ActionButton
      onClick={handleDelete}
      className={confirmation 
        ? "bg-destructive text-white border-destructive hover:bg-destructive hover:text-white hover:border-destructive" 
        : "text-muted-foreground hover:text-destructive hover:border-destructive"}
      tooltipContent={confirmation ? confirmationMessage : deleteMessage}
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">
        {confirmation ? confirmationMessage : deleteMessage}
      </span>
    </ActionButton>
  )
}

interface RestoreButtonProps {
  onRestore: () => void
}

export function RestoreButton({ onRestore }: RestoreButtonProps) {
  const { toast } = useToast()

  const handleRestore = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onRestore()
    toast({
      title: "Restored",
      description: "Previous form data has been restored",
    })
  }, [onRestore, toast])

  return (
    <ActionButton
      onClick={handleRestore}
      className="text-muted-foreground hover:text-emerald-600 hover:border-emerald-600/50"
      tooltipContent="Restore this prompt"
    >
      <RotateCcw className="h-4 w-4" />
      <span className="sr-only">Restore form data</span>
    </ActionButton>
  )
}

interface CallButtonProps {
  onCall?: () => Promise<void>
  onHangup?: () => Promise<void>
}

type CallState = 'idle' | 'connecting' | 'active' | 'error';

export function CallButton({ onCall, onHangup }: CallButtonProps) {
  const [callState, setCallState] = useState<CallState>('idle')
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const { toast } = useToast()

  const handleToggleCall = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    setTooltipOpen(false)  // Hide tooltip during state change
    
    try {
      if (callState === 'idle') {
        setCallState('connecting')
        await onCall?.()
        setCallState('active')
      } else if (callState === 'active') {
        await onHangup?.()
        setCallState('idle')
      } else if (callState === 'error') {
        setCallState('connecting')
        await onCall?.()
        setCallState('active')
      }
    } catch (error) {
      setCallState('error')
      toast({
        title: "Call Error",
        description: error instanceof Error ? error.message : "Failed to manage call",
        variant: "destructive",
      })
    }
    
    // Show tooltip with new state after a brief delay
    setTimeout(() => setTooltipOpen(true), 100)
  }, [callState, onCall, onHangup, toast])

  const getButtonContent = () => {
    switch (callState) {
      case 'connecting':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'active':
        return <PhoneOff className="h-4 w-4" />
      case 'error':
        return <Phone className="h-4 w-4 text-destructive" />
      default:
        return <Phone className="h-4 w-4" />
    }
  }

  const getTooltipContent = () => {
    switch (callState) {
      case 'connecting':
        return "Connecting call..."
      case 'active':
        return "End call"
      case 'error':
        return "Retry call"
      default:
        return "Start call"
    }
  }

  const getButtonStyles = () => {
    const baseStyles = "text-muted-foreground hover:text-primary hover:border-primary/50"
    switch (callState) {
      case 'active':
        return `${baseStyles} text-primary border-primary/50`
      case 'error':
        return `${baseStyles} text-destructive hover:text-destructive hover:border-destructive/50`
      default:
        return baseStyles
    }
  }

  return (
    <TooltipProvider>
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleCall}
            className={`${baseButtonStyles} ${getButtonStyles()}`}
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
          >
            {getButtonContent()}
            <span className="sr-only">{getTooltipContent()}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
