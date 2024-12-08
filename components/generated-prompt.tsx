"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"
import { useEffect, useState } from "react"
import { PromptHistory } from "./prompt-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PromptHistoryItem {
  id: string
  content: string
  timestamp: number
}

interface GeneratedPromptProps {
  prompt: string | null
  isLoading: boolean
}

const HISTORY_STORAGE_KEY = "prompt-history"

export function GeneratedPrompt({ prompt, isLoading }: GeneratedPromptProps) {
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
  }, [prompt, isLoading])

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
        {prompt && activeTab === "current" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(prompt)}
            className="text-xs"
          >
            Copy to Clipboard
          </Button>
        )}
      </div>

      <TabsContent value="current" className="mt-0">
        <div className="rounded-lg border bg-white p-6 text-sm">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900" />
            </div>
          ) : prompt ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{prompt}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Your generated prompt will appear here
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="history" className="mt-0">
        {history.length > 0 ? (
          <PromptHistory 
            history={history} 
            onDelete={deleteHistoryItem} 
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
