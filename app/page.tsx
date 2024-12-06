import Image from "next/image";

export default function Home() {
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
          {/* Form will go here */}
          <div className="h-[600px] border rounded-lg p-4">
            Form placeholder
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Result will go here */}
          <div className="h-[600px] border rounded-lg p-4">
            Result placeholder
          </div>
        </div>
      </div>
    </main>
  )
}
