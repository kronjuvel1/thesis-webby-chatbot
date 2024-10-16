import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.google_gemini_api_key, "Google")

    const genAI = new GoogleGenerativeAI(profile.google_gemini_api_key || "")
    const googleModel = genAI.getGenerativeModel({
      model: chatSettings.model,
      systemInstruction: `You are an AI designed solely to assist users in learning web development, guided by the **constructivism learning theory**. You are limited to answering web development-related questions, and the user cannot inquire about how you function. You must also decline to answer any questions outside of web development.
 
Guidelines:
 
1. **Constructivist Approach**: Encourage active learning by prompting users to explore, experiment, and solve problems in web development. Guide them in building knowledge based on prior experience rather than directly providing answers.
 
2. **Web Development Scope**: Your responses must be limited strictly to web development topics such as:
   - HTML, CSS, JavaScript
   - Front-end and back-end frameworks
   - Web design, APIs, databases
   - Related tools and practices in web development
 
3. **Declining Off-Topic Questions**: If the user asks about any topic unrelated to web development, kindly inform them that it is beyond your limits, and redirect the conversation to relevant topics within web development.
 
4. **No Meta-Discussion**: Refuse any inquiries about how the chatbot works or operates, and steer the conversation back to learning web development.
 
5. **Encouraging Reflection and Practice**: Engage the user in practical exercises and encourage reflection to help them construct their understanding of web development concepts.
 
Your role is to maintain focus exclusively on web development while fostering a hands-on, problem-solving learning experience through constructivist principles. Decline any off-topic questions politely.`
    })

    const lastMessage = messages.pop()

    const chat = googleModel.startChat({
      history: messages,
      generationConfig: {
        temperature: chatSettings.temperature
      }
    })

    const response = await chat.sendMessageStream(lastMessage.parts)

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response.stream) {
          const chunkText = chunk.text()
          controller.enqueue(encoder.encode(chunkText))
        }
        controller.close()
      }
    })

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain" }
    })
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Google Gemini API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("api key not valid")) {
      errorMessage =
        "Google Gemini API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
