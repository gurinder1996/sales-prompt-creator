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
  const [currentFormData, setCurrentFormData] = useState<FormValues | null>(null)

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
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [result])

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true)
    setCurrentFormData(values)
    try {
      const prompt = await generateSalesPrompt(values)
      setResult(prompt)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestoreFormData = (formData: FormValues) => {
    setCurrentFormData(formData)
  }

  const handleRestorePrompt = (prompt: string) => {
    setResult(prompt)
  }

  const handleClearPrompt = () => {
    setResult(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <PromptForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
          restoredFormData={currentFormData}
        />
      </div>
      <div className="mt-6 lg:mt-0 lg:pl-8">
        <GeneratedPrompt 
          prompt={result} 
          isLoading={isLoading}
          currentFormData={currentFormData || {} as FormValues}
          onRestoreFormData={handleRestoreFormData}
          onRestorePrompt={handleRestorePrompt}
          onClearPrompt={handleClearPrompt}
        />
      </div>
    </div>
  )
}
