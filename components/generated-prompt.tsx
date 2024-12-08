"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"

interface GeneratedPromptProps {
  prompt: string | null
  isLoading: boolean
}

export function GeneratedPrompt({ prompt, isLoading }: GeneratedPromptProps) {
  const { toast } = useToast()

  const copyToClipboard = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt)
      toast({
        title: "Copied!",
        description: "Markdown prompt copied to clipboard",
      })
    }
  }

  return (
    <div className="relative">
      <div className="absolute -top-[27px] right-0">
        {prompt && (
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="text-xs"
          >
            Copy to Clipboard
          </Button>
        )}
      </div>
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
    </div>
  )
}
