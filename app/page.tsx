/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { PromptForm } from "@/components/prompt-form"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [result] = useState<string>("")
  const { toast } = useToast()

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      // TODO: Implement OpenAI call
      console.log(values)
      toast({
        title: "Form submitted",
        description: "Check the console for the form values",
      })
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
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
          {/* Result will go here */}
          <div className="h-[600px] border rounded-lg p-4">
            {result || "Generated prompt will appear here"}
          </div>
        </div>
      </div>
    </main>
  )
}
