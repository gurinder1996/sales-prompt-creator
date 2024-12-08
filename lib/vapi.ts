import Vapi from "@vapi-ai/web";
import type { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

let client: Vapi | null = null;

export function initialize(apiKey: string | undefined | null) {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  if (client) {
    throw new Error('Vapi client already initialized');
  }

  // Initialize with API key
  client = new Vapi(apiKey);
}

export async function startCall(systemPrompt: string, context: { assistantName: string; companyName: string }) {
  if (!client) {
    throw new Error('Vapi client not initialized. Call initialize() first.');
  }

  try {
    // Create the assistant config
    const assistant: CreateAssistantDTO = {
      name: context.assistantName,
      voice: {
        provider: '11labs' as const,
        voiceId: 'JBFqnCBsd6RMkjVDRZzb' as const,
        stability: 0.6,
        similarityBoost: 0.75,
        fillerInjectionEnabled: false,
        optimizeStreamingLatency: 4,
      },
      model: {
        provider: 'openai' as const,
        model: 'gpt-4o' as const,
        messages: [
          { role: 'system' as const, content: systemPrompt },
          { 
            role: 'assistant' as const, 
            content: `Hi, this is ${context.assistantName} from ${context.companyName}, is this the owner?` 
          }
        ]
      },
      transcriber: {
        provider: 'deepgram' as const,
        model: 'nova-2' as const,
        language: 'en' as const
      }
    };

    // Start the call with the assistant config directly
    await client.start(assistant);
  } catch (error) {
    throw error;
  }
}

export async function endCall() {
  if (!client) {
    throw new Error('Vapi client not initialized. Call initialize() first.');
  }

  await client.stop();
}

export function setMuted(muted: boolean) {
  if (!client) {
    throw new Error('Vapi client not initialized. Call initialize() first.');
  }

  client.setMuted(muted);
}

export function isMuted(): boolean {
  if (!client) {
    throw new Error('Vapi client not initialized. Call initialize() first.');
  }

  return client.isMuted();
}
