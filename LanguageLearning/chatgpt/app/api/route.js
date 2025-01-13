import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request) {
  const req = await request.json();
  const opt = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: req?.message || "Hello chat, How are you",
        },
      ],
      // temperature: 0.7
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      opt
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
  }
}
