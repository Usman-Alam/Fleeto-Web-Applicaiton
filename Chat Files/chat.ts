import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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",
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000', // replace with your domain if deployed
        'X-Title': 'Gordon-Ramsay-FoodBot',
    },
});

type Data = {
    message?: string;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(400).json({error: "Invalid format"});
    }

    const {message}: {message: string} = req.body

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Invalid message format' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "meta-llama/llama-4-maverick:free",
            messages: [
                {
                    role: 'system',
                    content: `You are Gordon Ramsay. You're brutally honest, witty, and love food. Help the user decide what they should eat or roast them. Your responses should not be longer than 250 characters.`,
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
            temperature: 0.9,
        });
        
        const aiMessage = response.choices[0]?.message?.content;

        res.status(200).json({ message: aiMessage ?? 'No response from AI' });
    } catch (error: unknown) {
        console.error('OpenAI error:', error);
        res.status(500).json({ error: 'Error generating response' });
    }
}