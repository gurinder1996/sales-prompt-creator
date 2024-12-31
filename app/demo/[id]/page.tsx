"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCallState } from "@/lib/call-state"
import { Card } from "@/components/ui/card"
import { useParams } from "next/navigation"
import { voices } from "@/lib/voices"

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
  const [selectedVoiceId, setSelectedVoiceId] = useState(voices[0].id)
  const { initiateCall, endCall, state: callState } = useCallState()
  const isActiveCall = callState === 'active'
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
            voice_id: selectedVoiceId, // Use the selected voice ID
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
  }, [demoId, selectedVoiceId])

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
            companyName: settings.company_name,
            voice: {
              voiceId: selectedVoiceId,
              stability: 0.6,
              similarityBoost: 0.75,
              fillerInjectionEnabled: false,
              optimizeStreamingLatency: 4
            }
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">
            {settings?.ai_representative_name} from {settings?.company_name}
          </h1>
          <p className="text-muted-foreground">
            Click the button below to start a conversation
          </p>
        </div>

        <div className="space-y-4">
          <Select
            value={selectedVoiceId}
            onValueChange={setSelectedVoiceId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
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
            onClick={handleCallButton}
            disabled={!settings || loading}
            className="w-full"
            variant={isActiveCall ? "destructive" : "default"}
          >
            {isActiveCall ? (
              <>End Call</>
            ) : (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Start Call</span>
              </div>
            )}
          </Button>
        </div>

        {error && (
          <div className="text-sm text-red-500 text-center">
            {error}
          </div>
        )}
      </Card>
    </div>
  )
}
