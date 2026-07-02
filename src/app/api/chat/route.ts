import { type NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/services/gemini";
import type {
  Persona,
  PersonalityTone,
  ChatMessage,
} from "@/types/personas.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      personas,
      apiKey,
      personalityTone,
      temperature,
      conversationHistory,
    } = body;

    // Validate required fields
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    if (!personas || !Array.isArray(personas) || personas.length === 0) {
      return NextResponse.json(
        { error: "At least one persona is required" },
        { status: 400 }
      );
    }

    // Generate AI response with conversation context
    const response = await generateAIResponse(
      message.trim(),
      personas as Persona[],
      apiKey,
      temperature || 0.7,
      (personalityTone as PersonalityTone) || "default",
      (conversationHistory as ChatMessage[]) || []
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// import { type NextRequest, NextResponse } from "next/server";
// import { generateAIResponse } from "@/lib/services/gemini";
// import type { Persona, PersonalityTone } from "@/types/personas.types";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { message, personas, apiKey, personalityTone, temperature } = body;

//     // Validate required fields
//     if (!message || typeof message !== "string") {
//       return NextResponse.json(
//         { error: "Message is required" },
//         { status: 400 }
//       );
//     }

//     if (!apiKey || typeof apiKey !== "string") {
//       return NextResponse.json(
//         { error: "API key is required" },
//         { status: 400 }
//       );
//     }

//     if (!personas || !Array.isArray(personas) || personas.length === 0) {
//       return NextResponse.json(
//         { error: "At least one persona is required" },
//         { status: 400 }
//       );
//     }

//     // Generate AI response
//     const response = await generateAIResponse(
//       message.trim(),
//       personas as Persona[],
//       apiKey,
//       temperature || 0.7,
//       (personalityTone as PersonalityTone) || "default"
//     );

//     return NextResponse.json({ response });
//   } catch (error) {
//     console.error("Chat API error:", error);

//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
