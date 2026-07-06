import express from "express";
import Knowledge from "../models/Knowledge.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/chat", async (req, res) => {

  const { message } = req.body;

  const knowledge = await Knowledge.find();

  const context = knowledge
    .map(k => `Q: ${k.question}\nA: ${k.answer}`)
    .join("\n\n");

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `You are a campus assistant. 
Answer using ONLY this information.

${context}

If the answer is not in the information say:
"I don't have information about that.Try ask me something else."`
      },
      {
        role: "user",
        content: message
      }
    ]
  });

  res.json({
    reply: response.choices[0].message.content
  });

});

export default router;