"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"
import { Trash2, ChevronDown, Copy, RotateCcw } from "lucide-react"
import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { FormValues } from "./prompt-form"

interface PromptHistoryItem {
  id: string
  content: string
  timestamp: number
  formData: FormValues
}

interface PromptHistoryProps {
  history: PromptHistoryItem[]
  onDelete: (id: string) => void
  onRestore: (formData: FormValues, prompt: string) => void
}

const ITEMS_PER_PAGE = 10

export function PromptHistory({ history, onDelete, onRestore }: PromptHistoryProps) {
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(0)
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE)
  const startIndex = currentPage * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = history.slice(startIndex, endIndex)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Markdown prompt copied to clipboard",
    })
  }

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {currentItems.map((item) => {
          const { date, time } = formatTimestamp(item.timestamp)
          const isOpen = openItems.has(item.id)
          
          return (
            <Collapsible
              key={item.id}
              open={isOpen}
              onOpenChange={() => toggleItem(item.id)}
              className="rounded-md border bg-white/50 transition-colors hover:bg-white"
            >
              <div className="flex items-center justify-between p-2">
                <CollapsibleTrigger asChild>
                  <button className="flex min-w-0 flex-1 items-center gap-2 text-sm hover:bg-white/50 rounded-sm px-2 py-1">
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                    <span className="min-w-0 flex-1 truncate text-left">
                      {item.content.split('\n')[0].substring(0, 100)}...
                    </span>
                    <span className="ml-2 shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                      {date} {time}
                    </span>
                  </button>
                </CollapsibleTrigger>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(item.content)
                    }}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-primary shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy to clipboard</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRestore(item.formData, item.content)
                      toast({
                        title: "Form Restored",
                        description: "Previous form data has been restored",
                      })
                    }}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-emerald-600 shrink-0"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="sr-only">Restore form data</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(item.id)
                    }}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete history item</span>
                  </Button>
                </div>
              </div>
              <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                <div className="border-t bg-white/50 p-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{item.content}</ReactMarkdown>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
