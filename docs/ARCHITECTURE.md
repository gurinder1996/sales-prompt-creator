# Sales Prompt Creator - Architecture Documentation

## Overview
A single-page Next.js application that replaces the Make.com automation for generating AI sales representative prompts. The application is entirely client-side, with no backend requirements, making it simple to deploy and maintain.

## Core Technologies
- **Framework**: Next.js with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form with Zod validation
- **API Integration**: OpenAI SDK
- **State Management**: Local storage for API key persistence

## Component Structure

### Pages
- `app/page.tsx`: Main application page
  - Houses the entire application in a single view
  - Manages client-side state and form submission logic

### Components
1. **Form Components** (`components/`)
   - `PromptForm.tsx`: Main form container
   - `ApiKeyInput.tsx`: OpenAI API key input with local storage integration
   - `ModelSelector.tsx`: GPT model selection dropdown
   - `ResultDisplay.tsx`: Generated prompt display area

### Type Definitions (`types/`)
```typescript
interface FormData {
  aiName: string;
  companyName: string;
  industry: string;
  targetAudience: string;
  challenges: string;
  product: string;
  objective: string;
  objections: string;
  additionalInfo?: string;
}

interface OpenAIConfig {
  apiKey: string;
  model: string;
}
```

### Utilities (`lib/`)
- `openai.ts`: OpenAI API integration and prompt generation
- `localStorage.ts`: API key persistence helpers
- `validation.ts`: Zod schemas for form validation

## Data Flow
1. User enters OpenAI API key (stored in localStorage)
2. User fills out the form with company and sales context
3. Form data is validated using Zod
4. On submission:
   - OpenAI API is called directly from the client
   - Generated prompt is displayed in the result area
   - Option to copy or regenerate is provided

## UI Components Used (shadcn/ui)
- `Form`: Form layout and validation
- `Input`: Text input fields
- `Textarea`: Longer text inputs
- `Button`: Form submission and actions
- `Card`: Layout containers
- `Select`: Model selection
- `Alert`: Error messages
- `Toast`: Success/failure notifications

## Security Considerations
- OpenAI API key is stored only in the client's localStorage
- No server-side storage or processing
- All API calls are made directly from the client to OpenAI
- Input validation to prevent malicious content

## Performance Optimizations
- Client-side rendering for instant feedback
- Form field validation on blur
- Debounced API calls
- Proper error handling with user feedback

## Future Considerations
- Prompt history in localStorage (optional)
- Export/import functionality
- Template management
- A/B testing different prompt structures
