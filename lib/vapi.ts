import Vapi from "@vapi-ai/web";
import type { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

class VapiClientSingleton {
  private static instance: VapiClientSingleton;
  private client: Vapi | null = null;
  private isCallActive = false;
  private apiKey: string | null = null;
  private muted = false;

  private constructor() {}

  public static getInstance(): VapiClientSingleton {
    if (!VapiClientSingleton.instance) {
      VapiClientSingleton.instance = new VapiClientSingleton();
    }
    return VapiClientSingleton.instance;
  }

  public initialize(apiKey: string | undefined | null) {
    if (!apiKey) {
      throw new Error('API key is required');
    }
    
    // Always update the API key
    this.apiKey = apiKey;
    
    // If we have an active call, we can't change the client
    if (this.isCallActive) {
      return;
    }
    
    // If client exists with a different key, clean it up
    if (this.client) {
      this.client = null;
    }
  }

  public async startCall(systemPrompt: string, context: { assistantName: string; companyName: string }) {
    if (!this.apiKey) {
      throw new Error('API key not set. Call initialize() first.');
    }

    if (this.isCallActive) {
      throw new Error('Another call is currently in progress. Please end the current call before starting a new one.');
    }

    try {
      // Always create a fresh client with the current API key
      this.client = new Vapi(this.apiKey);

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
            { role: 'system' as const, content: systemPrompt }
          ]
        },
        firstMessage: `Hi, this is ${context.assistantName} from ${context.companyName}, is this the owner?`,
        transcriber: {
          provider: 'deepgram' as const,
          model: 'nova-2' as const,
          language: 'en' as const
        }
      };

      await this.client.start(assistant);
      this.isCallActive = true;
    } catch (error) {
      // If there's an error, clean up completely
      this.client = null;
      this.isCallActive = false;
      throw error;
    }
  }

  public async endCall() {
    if (!this.client) {
      return;
    }

    try {
      await this.client.stop();
    } catch (error) {
      console.error('Error stopping call:', error);
    } finally {
      // Always clean up completely
      this.client = null;
      this.isCallActive = false;
      this.muted = false;
    }
  }

  public isInCall(): boolean {
    return this.isCallActive;
  }

  public setMuted(muted: boolean) {
    if (!this.client) {
      throw new Error('Vapi client not initialized. Call initialize() first.');
    }

    this.client.setMuted(muted);
    this.muted = muted;
  }

  public isMuted(): boolean {
    if (!this.client) {
      throw new Error('Vapi client not initialized. Call initialize() first.');
    }

    return this.muted;
  }
}

// Export a singleton instance
const vapiClient = VapiClientSingleton.getInstance();

// Export wrapper functions that use the singleton
export function initialize(apiKey: string | undefined | null) {
  return vapiClient.initialize(apiKey);
}

export function startCall(systemPrompt: string, context: { assistantName: string; companyName: string }) {
  return vapiClient.startCall(systemPrompt, context);
}

export function endCall() {
  return vapiClient.endCall();
}

export function isCallInProgress(): boolean {
  return vapiClient.isInCall();
}

export function setMuted(muted: boolean) {
  return vapiClient.setMuted(muted);
}

export function isMuted(): boolean {
  return vapiClient.isMuted();
}
