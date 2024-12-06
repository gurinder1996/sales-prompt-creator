/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { PromptForm } from "@/components/prompt-form"
import { generateSalesPrompt } from "@/lib/openai"
import { GeneratedPrompt } from "@/components/generated-prompt"

const STORAGE_KEY = "sales-prompt-result"

export function PromptContainer() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  // Load saved result from localStorage
  useEffect(() => {
    const savedResult = localStorage.getItem(STORAGE_KEY)
    if (savedResult) {
      setResult(savedResult)
    }
  }, [])

  // Save result to localStorage when it changes
  useEffect(() => {
    if (result) {
      localStorage.setItem(STORAGE_KEY, result)
    }
  }, [result])

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
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <PromptForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
      <div className="lg:pl-8">
        <GeneratedPrompt prompt={result} isLoading={isLoading} />
      </div>
    </div>
  )
}
