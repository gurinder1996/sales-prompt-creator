/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { PromptForm } from "@/components/prompt-form"
import { useToast } from "@/hooks/use-toast"
import { generateSalesPrompt } from "@/lib/openai"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>("")
  const { toast } = useToast()

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const generatedPrompt = await generateSalesPrompt(values)
      setResult(generatedPrompt)
      toast({
        title: "Success!",
        description: "Your sales prompt has been generated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate prompt",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      })
    }
  }

  return (
    <main className="container mx-auto py-10 space-y-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">AI Sales Prompt Creator</h1>
        <p className="text-muted-foreground">
          Generate personalized AI sales representative prompts by filling out the form below
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PromptForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Generated Prompt</h2>
                {result && (
                  <Button
                    variant="outline"
                    onClick={handleCopy}
                  >
                    Copy to Clipboard
                  </Button>
                )}
              </div>
              <div className="h-[600px] overflow-y-auto whitespace-pre-wrap font-mono text-sm border rounded-lg p-4 bg-muted">
                {result || "Generated prompt will appear here"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
