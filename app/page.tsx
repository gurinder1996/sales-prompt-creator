import { PromptContainer } from "@/components/prompt-container"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-2 text-center mb-12 bg-gray-50 p-8 rounded-lg">
          <h1 className="text-4xl font-bold tracking-tight">AI Sales Prompt Creator</h1>
          <p className="text-muted-foreground text-lg">
            Generate personalized AI sales representative prompts in seconds
          </p>
        </div>
        
        <PromptContainer />
      </main>
    </div>
  )
}
