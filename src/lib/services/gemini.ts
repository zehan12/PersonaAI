import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  Persona,
  PersonalityTone,
  ChatMessage,
} from "@/types/personas.types";

// Function to create persona context (prompt)
function createPersonaContext(
  persona: Persona,
  personalityTone: PersonalityTone = "default"
) {
  let context = `
    PERSONA IDENTITY:
    You are ${persona.basic_information.name} (${
    persona.basic_information.nickname
  }),
    a ${persona.basic_information.occupation}.
    Age: ${persona.basic_information.age}, Gender: ${
    persona.basic_information.gender
  }
    Location: ${persona.basic_information.location.city}, ${
    persona.basic_information.location.country
  }
    Languages: ${persona.basic_information.languages.join(", ")}

    BIOGRAPHY:
    Short Bio: ${persona.biography.bio_short}
    Long Bio: ${persona.biography.bio_long}
    Career Journey: ${persona.biography.career_journey}
    Current Focus: ${persona.biography.current_focus}
    Achievements: ${persona.biography.achievements.join(", ")}
    Skills: Technical - ${persona.personality_and_style.skills.technical.join(
      ", "
    )},
            Soft - ${persona.personality_and_style.skills.soft.join(", ")}

    PERSONALITY & STYLE:
    Traits: ${persona.personality_and_style.traits.join(", ")}
    Tone of Voice: ${persona.personality_and_style.tone_of_voice}
    Likes: ${persona.personality_and_style.likes.join(", ")}
    Dislikes: ${persona.personality_and_style.dislikes.join(", ")}
    Values: ${persona.personality_and_style.values.join(", ")}
    Goals: Short Term - ${persona.personality_and_style.goals.short_term.join(
      ", "
    )}
           Long Term - ${persona.personality_and_style.goals.long_term.join(
             ", "
           )}
    Catchphrases: ${persona.personality_and_style.catchphrases.join(" | ")}

    KNOWLEDGE BASE:
    Topics of Expertise: ${persona.knowledge_base.topics_of_expertise.join(
      ", "
    )}

    DIGITAL PRESENCE:
    Instagram: ${persona.digital_presence.social_media.instagram.handle}
      - Sample Comments: ${persona.digital_presence.social_media.instagram.comments_samples.join(
        " | "
      )}
      - Sample Replies: ${persona.digital_presence.social_media.instagram.reply_samples.join(
        " | "
      )}
    Twitter: ${persona.digital_presence.social_media.twitter.handle}
      - Sample Comments: ${persona.digital_presence.social_media.twitter.comments_samples.join(
        " | "
      )}
      - Sample Replies: ${persona.digital_presence.social_media.twitter.reply_samples.join(
        " | "
      )}
    LinkedIn: ${persona.digital_presence.social_media.linkedin.handle}
      - Posts: ${persona.digital_presence.social_media.linkedin.posts.join(
        " | "
      )}
      - Sample Comments: ${persona.digital_presence.social_media.linkedin.comments_samples.join(
        " | "
      )}
    YouTube: ${persona.digital_presence.social_media.youtube.channel_name} (${
    persona.digital_presence.social_media.youtube.link
  })
      - Transcripts: ${persona.digital_presence.social_media.youtube.subtitles_transcripts.join(
        " || "
      )}
    GitHub: ${persona.digital_presence.social_media.github.profile_link}
      - Repos: ${persona.digital_presence.social_media.github.repositories
        .map((r) => r.name + " (" + r.link + ")")
        .join(" | ")}
    Personal Website: ${persona.digital_presence.personal_website}

    WORK & CONTENT:
    Courses: ${persona.work_and_content.courses
      .map((c) => c.course_name + " (" + c.link + ")")
      .join(" | ")}
    Projects: ${persona.work_and_content.projects
      .map((p) => p.name + " - " + p.description + " (" + p.link + ")")
      .join(" | ")}
    Books/Publications: ${
      persona.work_and_content.books_or_publications.join(", ") || "None"
    }
    Events/Talks: ${
      persona.work_and_content.events_or_talks.join(", ") || "None"
    }

    BEHAVIOR RULES:
    - Preferred length: ${persona.ai_persona_behavior.preferred_length}
    - Roleplay mode: ${persona.ai_persona_behavior.roleplay_mode}
    - Avoid topics: ${persona.ai_persona_behavior.do_not_respond_topics.join(
      ", "
    )}

    YOUR COMMUNICATION STYLE:
    - Be helpful, engaging, and knowledgeable about ${persona.knowledge_base.topics_of_expertise.join(
      ", "
    )}
    - Respond casually, like you're texting a friend.
    - Use real examples and mimic the tone found in the provided replies/comments.
    - Keep responses conversational and accessible
`;

  if (personalityTone !== "default") {
    context += `\n\nSPECIAL TONE INSTRUCTIONS:`;

    switch (personalityTone) {
      case "funny":
        context += `
        - Be extra humorous and playful in your responses
        - Use more jokes, emojis, and light-hearted expressions
        - Don't take anything too seriously
        - Make the conversation fun and entertaining`;
        break;

      case "advice":
        context += `
        - Focus on giving practical, actionable advice
        - Be more mentorship-oriented and supportive
        - Share insights that might help the user
        - Be encouraging but realistic with your guidance`;
        break;

      case "educational":
        context += `
        - Be more explanatory and detailed in your responses
        - Focus on teaching concepts clearly and thoroughly
        - Use examples to illustrate points when relevant
        - Be patient and pedagogical in your approach`;
        break;
    }
  }

  return context.trim();
}

function formatConversationHistory(
  messages: ChatMessage[],
  maxMessages = 10
): string {
  if (!messages || messages.length === 0) {
    return "";
  }

  // Get the last N messages for context (excluding the current message)
  const recentMessages = messages.slice(-maxMessages);

  let historyText = "\n\nCONVERSATION HISTORY:\n";
  historyText += "Here's our recent conversation for context:\n\n";

  recentMessages.forEach((msg, index) => {
    const role = msg.sender === "user" ? "User" : "Assistant";
    const content = msg.content || "";
    historyText += `${role}: ${content}\n`;
  });

  historyText +=
    "\nPlease consider this conversation history when responding to maintain continuity and context.\n";

  return historyText;
}

// Function to generate AI response
export async function generateAIResponse(
  message: string,
  activePersonas: Persona[],
  apiKey: string,
  temperature = 0.7,
  personalityTone: PersonalityTone = "default",
  conversationHistory: ChatMessage[] = []
) {
  if (!apiKey) {
    throw new Error("API key is required");
  }

  if (!activePersonas.length) {
    throw new Error("At least one persona must be selected");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 500,
        temperature: temperature,
      },
    });

    const historyContext = formatConversationHistory(conversationHistory);

    if (activePersonas.length === 1) {
      const persona = activePersonas[0];
      const context = createPersonaContext(persona, personalityTone);
      const userInstruction = `
        TASK:
        Respond to this message: "${message}"
        RESPONSE GUIDELINES:
        - Respond as ${persona.basic_information.name}, the ${
        persona.basic_information.occupation
      }
        - Keep your response to 3-4 lines unless more detail is specifically requested
        - Stay helpful and engaging
        - Use your expertise in ${persona.knowledge_base.topics_of_expertise.join(
          ", "
        )} when relevant
        - Reference previous conversation points when relevant to maintain continuity`;

      const prompt = context + historyContext + userInstruction;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } else {
      // Multi-persona response with conversation context
      const responses: Record<string, string> = {};
      for (const persona of activePersonas) {
        const context = createPersonaContext(persona, personalityTone);
        const userInstruction = `
          TASK:
          Respond to this message: "${message}"
          RESPONSE GUIDELINES:
          - Respond as ${persona.basic_information.name}, the ${
          persona.basic_information.occupation
        }
          - Keep your response to 2-3 lines since multiple personas are responding
          - Stay helpful and engaging
          - Use your expertise in ${persona.knowledge_base.topics_of_expertise.join(
            ", "
          )} when relevant
          - Reference previous conversation points when relevant to maintain continuity`;

        const prompt = context + historyContext + userInstruction;
        const result = await model.generateContent(prompt);
        responses[persona.basic_information.name] = result.response.text();
      }

      // Format multi-persona response
      let formattedResponse = "";
      for (const [name, response] of Object.entries(responses)) {
        formattedResponse += `**${name}:**\n${response}\n\n`;
      }
      return formattedResponse.trim();
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    if (error instanceof Error) {
      if (error.message.includes("API_KEY_INVALID")) {
        throw new Error("Invalid API key. Please check your Gemini API key.");
      }
      if (error.message.includes("QUOTA_EXCEEDED")) {
        throw new Error("API quota exceeded. Please check your usage limits.");
      }
      if (error.message.includes("SAFETY")) {
        throw new Error(
          "Content was blocked by safety filters. Please try rephrasing your message."
        );
      }
      throw new Error(`AI service error: ${error.message}`);
    }
    throw new Error("Failed to generate AI response. Please try again.");
  }
}
