"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy, Trash2, RotateCcw } from "lucide-react"
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
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={`${baseButtonStyles} ${className}`}
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <ActionButton
            onClick={handleCopy}
            className="text-muted-foreground hover:text-primary hover:border-primary/50"
            tooltipContent="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy to clipboard</span>
          </ActionButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy to clipboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent>
          <p>{confirmation ? confirmationMessage : deleteMessage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <ActionButton
            onClick={handleRestore}
            className="text-muted-foreground hover:text-emerald-600 hover:border-emerald-600/50"
            tooltipContent="Restore this prompt"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Restore form data</span>
          </ActionButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Restore this prompt</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
