'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const SYSTEM_PROMPT = `You are a concise Hair & Beauty Booking Assistant. Help clients book appointments for:
- Hair (cuts, color, styling)
- Nails (manicure, pedicure)
- Face & Skin treatments
- Makeup services

Guidelines:
1. Keep responses brief and focused
2. Ask only essential questions
3. Collect key details: service, date/time, specific requirements
4. Use British English and £ pricing
5. Maintain a friendly but efficient tone

Keep all responses under 50 words. Be direct and precise.`;

export async function getChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        // Only send the last 4 messages for context
        ...messages.slice(-4)
      ],
      temperature: 0.5,
      max_tokens: 150,
      presence_penalty: -0.5, // Encourage shorter, focused responses
      frequency_penalty: 0.3, // Reduce repetition
    });

    return response.choices[0]?.message?.content || "Sorry, please try again.";
  } catch (error) {
    console.error('Error getting chat response:', error);
    return "Sorry, please try again later.";
  }
} 