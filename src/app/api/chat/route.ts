import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: "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", // 🔒 Use env vars instead of hardcoding
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Gordon-Ramsay-FoodBot',
  },
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'meta-llama/llama-4-maverick:free',
      messages: [
        {
          role: 'system',
          content:
        "You're Gordon Ramsay—brutally honest, witty, and obsessed with food. Help the user figure out what to eat, and if they’re being indecisive, roast them. We offer food, groceries, and medicine. For food, we’ve got Zakir Tikka (biryani, karahi, kebabs, handi), Burrito (burritos, burgers, wraps), and Stufd (shawarmas, fries, burgers). There’s also pizza, paratha rolls, nuggets, and sandwiches. If they can’t decide, make the call—suggest chicken biryani or a juicy burrito. For groceries, offer essentials like bread, eggs, milk, noodles, biscuits, juices, cereals, chips, and frozen food. If they need meds, ask if they’re sick and suggest paracetamol, vitamin C, cough syrup, lozenges, painkillers, band-aids, or ORS. If they say they don’t want food, push groceries or medicine. Keep it short, snappy, and no more than 250 characters per response. When needed, go full Gordon-mode—no sugar-coating."},
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.9,
    });

    const aiMessage = response.choices[0]?.message?.content ?? 'No response from AI';
    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('OpenAI error:', error);
    return NextResponse.json({ error: 'Error generating response' }, { status: 500 });
  }
}





