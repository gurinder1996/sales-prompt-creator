"use client"

import { CopyButton, DeleteButton } from "./prompt-actions"
import ReactMarkdown from "react-markdown"
import { useEffect, useState } from "react"
import { PromptHistory } from "./prompt-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

  const handleRestoreItem = (formData: FormValues, prompt: string) => {
    onRestoreFormData(formData)
    onRestorePrompt(prompt)
    setActiveTab("current")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-1 flex-none">
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

      <div className="flex-1 min-h-0 relative">
        <TabsContent value="current" className="absolute inset-0">
          <div className="relative h-full flex flex-col">
            {isLoading ? (
              <div className="prose prose-sm max-w-none rounded-md border bg-white/50 p-4 dark:prose-invert h-full">
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900" />
                </div>
              </div>
            ) : prompt ? (
              <div className="prose prose-sm max-w-none rounded-md border bg-white/50 p-4 dark:prose-invert flex flex-col h-full">
                <div className="overflow-auto flex-1">
                  <ReactMarkdown>{prompt}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border bg-white p-6 text-sm text-center text-muted-foreground h-full">
                Your generated prompt will appear here.
              </div>
            )}
            {prompt && !isLoading && (
              <div className="absolute right-2 -top-4 flex gap-1">
                <CopyButton text={prompt} />
                <DeleteButton 
                  onDelete={onClearPrompt}
                  deleteMessage="Clear prompt"
                  confirmationMessage="Click to confirm clearing"
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="absolute inset-0 overflow-auto">
          {history.length > 0 ? (
            <PromptHistory 
              history={history} 
              onDelete={(id: string) => setHistory(prev => prev.filter(item => item.id !== id))}
              onRestore={handleRestoreItem}
            />
          ) : (
            <div className="rounded-lg border bg-white p-6 text-sm text-center text-muted-foreground">
              No history yet. Generated prompts will appear here.
            </div>
          )}
        </TabsContent>
      </div>
    </Tabs>
  )
}
