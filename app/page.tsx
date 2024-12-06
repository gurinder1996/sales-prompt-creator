/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { PromptForm } from "@/components/prompt-form"
import { generateSalesPrompt } from "@/lib/openai"
import { GeneratedPrompt } from "@/components/generated-prompt"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const prompt = await generateSalesPrompt(values)
      setResult(prompt)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-2 text-center mb-12 bg-gray-50 p-8 rounded-lg">
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
            <GeneratedPrompt prompt={result} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  )
}
