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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-2 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">AI Sales Prompt Creator</h1>
          <p className="text-muted-foreground text-lg">
            Generate personalized AI sales representative prompts in seconds
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div>
            <PromptForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          
          <div className="lg:pl-8">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Generated Prompt</h2>
                  {result && (
                    <Button
                      variant="outline"
                      onClick={handleCopy}
                      className="ml-4"
                    >
                      Copy to Clipboard
                    </Button>
                  )}
                </div>
                <div className="h-[calc(100vh-20rem)] overflow-y-auto whitespace-pre-wrap font-mono text-sm border rounded-lg p-4 bg-muted/50">
                  {result || "Your generated prompt will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
