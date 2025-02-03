import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(reqest: Request) {
try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is missing. Set it in .env.local.");
    }

    const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        stream: true, 
    }),
    });

    const stream = new ReadableStream({
    async start(controller) {
        if (!response.body) {
            throw new Error("No response body received from DeepSeek API.");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(decoder.decode(value)); 
        }
        controller.close();
    },
    });

    return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
} catch (error) {
    console.error("An error occurred:", error);
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}

