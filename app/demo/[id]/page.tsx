"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCallState } from "@/lib/call-state"
import { Card } from "@/components/ui/card"
import { useParams } from "next/navigation"

interface DemoSettings {
  id: string
  ai_representative_name: string
  company_name: string
  industry: string
  target_audience: string
  product_service_description: string
  challenges_solved: string
  call_objective: string
  common_objections: string
  additional_context?: string | null
  system_prompt: string
  model_name: string
  first_message: string
  vapi_key: string // This will be populated from vapiKey in Supabase
  // Voice settings (hardcoded for now)
  voice_provider: string
  voice_id: string
  voice_stability: number
  voice_similarity_boost: number
  voice_filler_injection_enabled: boolean
  voice_optimize_streaming_latency: number
}

interface Voice {
  id: string
  name: string
  provider: string
}

export default function DemoPage() {
  const params = useParams()
  const demoId = params?.id as string
  const [settings, setSettings] = useState<DemoSettings | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<string>("JBFqnCBsd6RMkjVDRZzb") // Default 11labs voice
  const [voices] = useState<Voice[]>([
    { id: "JBFqnCBsd6RMkjVDRZzb", name: "Rachel", provider: "11labs" },
    // Add more voices as needed
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { initiateCall, endCall, state: callState } = useCallState()
  const isActiveCall = callState === "active" || callState === "connecting"

  useEffect(() => {
    const fetchSettings = async () => {
      if (!demoId) return

      try {
        // First check localStorage
        const cachedSettings = localStorage.getItem(`demo-${demoId}`)
        if (cachedSettings) {
          setSettings(JSON.parse(cachedSettings))
          setLoading(false)
          return
        }

        // If not in cache, fetch from Supabase
        const { data, error: supabaseError } = await supabase
          .from("voice_agent_configs")
          .select("id, ai_representative_name, company_name, industry, target_audience, product_service_description, challenges_solved, call_objective, common_objections, additional_context, system_prompt, model_name, first_message")
          .eq("id", demoId)
          .single()

        if (supabaseError) {
          console.error("Error fetching demo settings:", supabaseError)
          throw supabaseError
        }

        if (data) {
          console.log("Supabase data:", data)
          // Always use the same VAPI key for demo pages
          const settingsWithDefaults = {
            ...data,
            vapi_key: "a4282df5-5a2d-493c-b6c3-a8f7837b9bbc", // Hardcoded VAPI key for all demos
            voice_provider: '11labs',
            voice_id: 'JBFqnCBsd6RMkjVDRZzb',
            voice_stability: 0.6,
            voice_similarity_boost: 0.75,
            voice_filler_injection_enabled: false,
            voice_optimize_streaming_latency: 4
          }
          setSettings(settingsWithDefaults as DemoSettings)
          // Store in localStorage for persistence
          localStorage.setItem(`demo-${demoId}`, JSON.stringify(settingsWithDefaults))
        } else {
          throw new Error("Demo not found")
        }
      } catch (err) {
        console.error("Error fetching demo settings:", err)
        setError("Failed to load demo settings. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [demoId])

  const handleCallButton = async () => {
    if (!settings || !demoId) return

    if (isActiveCall) {
      await endCall(demoId)
    } else {
      try {
        // Always use the hardcoded VAPI key for demo calls
        const DEMO_VAPI_KEY = "a4282df5-5a2d-493c-b6c3-a8f7837b9bbc"
        console.log('VAPI Key from settings:', DEMO_VAPI_KEY)
        await initiateCall(
          demoId,
          DEMO_VAPI_KEY,
          settings.system_prompt,
          {
            assistantName: settings.ai_representative_name,
            companyName: settings.company_name
          }
        )
      } catch (err) {
        console.error("Failed to initiate call:", err)
        setError("Failed to start call. Please try again.")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading demo settings...</div>
      </div>
    )
  }

  if (error || !settings) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="p-6">
          <div className="text-lg text-red-500">{error || "Demo not found"}</div>
          <div className="mt-4">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold">
            {settings.ai_representative_name} from {settings.company_name}
          </h1>
          <p className="text-gray-600">
            Click the button below to start a conversation
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="lg"
            onClick={handleCallButton}
            className={`${
              isActiveCall ? "bg-red-500 hover:bg-red-600" : ""
            } h-16 w-16 rounded-full p-4`}
          >
            <Phone className="h-8 w-8" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
