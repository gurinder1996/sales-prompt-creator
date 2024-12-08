"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"
import { useEffect, useState } from "react"
import { PromptHistory } from "./prompt-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, X } from "lucide-react"
import { FormValues } from "./prompt-form"

interface PromptHistoryItem {
  id: string
  content: string
  timestamp: number
  formData: FormValues
}

interface GeneratedPromptProps {
  prompt: string | null
  isLoading: boolean
  currentFormData: FormValues
  onRestoreFormData: (formData: FormValues) => void
  onRestorePrompt: (prompt: string) => void
  onClearPrompt: () => void
}

const HISTORY_STORAGE_KEY = "prompt-history"

export function GeneratedPrompt({ 
  prompt, 
  isLoading, 
  currentFormData,
  onRestoreFormData,
  onRestorePrompt,
  onClearPrompt
}: GeneratedPromptProps) {
  const { toast } = useToast()
  const [history, setHistory] = useState<PromptHistoryItem[]>([])
  const [activeTab, setActiveTab] = useState("current")

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
  }, [history])

  // Add new prompt to history
  useEffect(() => {
    if (prompt && !isLoading) {
      const newItem: PromptHistoryItem = {
        id: Math.random().toString(36).substring(7),
        content: prompt,
        timestamp: Date.now(),
        formData: { ...currentFormData }
      }
      setHistory(prev => {
        // Check if this exact prompt is already in history
        if (!prev.some(item => item.content === prompt)) {
          return [newItem, ...prev]
        }
        return prev
      })
      // Switch to current tab when new prompt is generated
      setActiveTab("current")
    }
  }, [prompt, isLoading, currentFormData])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Markdown prompt copied to clipboard",
    })
  }

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
    toast({
      title: "Deleted",
      description: "Prompt removed from history",
    })
  }

  const handleRestoreItem = (formData: FormValues, prompt: string) => {
    onRestoreFormData(formData)
    onRestorePrompt(prompt)
    setActiveTab("current")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="history" className="relative">
            History
            {history.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {history.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="current" className="mt-0">
        <div className="relative mt-4">
          <div className="prose prose-sm max-w-none rounded-md border bg-white/50 p-4 dark:prose-invert">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900" />
              </div>
            ) : prompt ? (
              <ReactMarkdown>{prompt}</ReactMarkdown>
            ) : (
              <div className="text-center text-muted-foreground">
                Your generated prompt will appear here
              </div>
            )}
          </div>
          {prompt && !isLoading && (
            <div className="absolute right-2 -top-4 flex gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full border shadow-sm"
                onClick={() => copyToClipboard(prompt)}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy to clipboard</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full border shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => {
                  onClearPrompt()
                  toast({
                    title: "Cleared",
                    description: "Prompt removed from current view",
                  })
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear prompt</span>
              </Button>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="history" className="mt-0">
        {history.length > 0 ? (
          <PromptHistory 
            history={history} 
            onDelete={deleteHistoryItem} 
            onRestore={handleRestoreItem}
          />
        ) : (
          <div className="rounded-lg border bg-white p-6 text-sm text-center text-muted-foreground">
            No history yet. Generated prompts will appear here.
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
