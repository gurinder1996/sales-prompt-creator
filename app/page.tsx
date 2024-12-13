import { PromptContainer } from "@/components/prompt-container"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <SiteHeader />
        
        <PromptContainer />
      </main>
    </div>
  )
}
