import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function getAIResponse(context, question) {

  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: `Answer using this college information only:\n${context}`
      },
      {
        role: "user",
        content: question
      }
    ]
  });

  return response.choices[0].message.content;
}