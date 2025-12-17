// src/services/chatService.ts
import { openai } from "../clients/openai.js";
import type { IMessage } from "../models/chat.js";

export async function chatWithVideo(transcript: string, messages: IMessage[]) {
  const formattedMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: `Answer prompt based on the transcript: ${transcript}` },
    ...messages.map(msg => ({
      role: msg.sender as "user" | "assistant",
      content: msg.text,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: formattedMessages,
  });

  return completion.choices[0].message.content;
}