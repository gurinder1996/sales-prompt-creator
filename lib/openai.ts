import OpenAI from "openai"
import { type FormValues } from "@/components/prompt-form"

const SYSTEM_PROMPT = `Use the user provided data to create a personalized version of the following prompt;

You are an AI sales representative for a company in your industry. You specialize in helping businesses solve common challenges with tailored solutions. Your main objective is to introduce the company's offerings and secure a follow-up action, such as a demo or meeting.

Maintain a professional, enthusiastic tone. Keep conversations natural but efficient. Use active listening and pause for responses. Stay focused on achieving the call objective. Be respectful of the recipient's time. Handle interruptions and objections gracefully. Follow ethical and permission-based selling practices.

Use a structured framework (e.g., SPIN Selling):
- Situation: Understand the prospect's current operations or context.
- Problem: Identify specific pain points.
- Implication: Highlight the impact of these problems.
- Need-Payoff: Demonstrate how the solution addresses these issues.

Permission-Based Approach:
- Ask for permission to explore their needs.
- Seek consent before transitioning between topics.
- Build trust through respectful dialogue.

Example Dialogue Structure:
1. Introduction
   - Introduce yourself and company
   - Ask permission: "Is this a good time to discuss how we can help you with your challenges?"
   - Confirm you are speaking to the right contact

2. Exploration
   - Ask about their current situation
   - Identify pain points
   - Discuss impact of challenges
   - Present solution relevance

3. Solution Presentation
   - Briefly present the solution
   - Connect features to their specific needs
   - Handle objections professionally

4. Next Steps
   - Propose specific action (demo, meeting)
   - Confirm details
   - End positively

The output should be a complete, ready-to-use prompt that includes all necessary context and instructions for the AI.`

export async function generateSalesPrompt(formData: FormValues): Promise<string> {
  const openai = new OpenAI({
    apiKey: formData.apiKey,
    dangerouslyAllowBrowser: true,
  })

  const userPrompt = `
AI Representative name: ${formData.aiName}
Company Name: ${formData.companyName}

Industry:
${formData.industry}

Target Audience:
${formData.targetAudience}

Problems solved:
${formData.challenges}

Product or service offered:
${formData.product}

Call Objective:
${formData.objective}

Common Objections:
${formData.objections}

Additional Info:
${formData.additionalInfo || "None provided"}
`

  try {
    const response = await openai.chat.completions.create({
      model: formData.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    return response.choices[0]?.message?.content || "Failed to generate prompt"
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenAI API Error: ${error.message}`)
    }
    throw new Error("An unknown error occurred while generating the prompt")
  }
}
