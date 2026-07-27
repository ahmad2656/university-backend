const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const systemPrompts = {
  student: `You are UniBot, a friendly AI assistant for UniBoard Student Portal.
Answer ONLY based on the student's real data provided. Do not make up information.
If data is not available, say "I don't have that information right now."`,

  teacher: `You are UniBot, a professional AI assistant for UniBoard Teacher Portal.
Help teachers with attendance, grades, assignments, and student management.`,

  admin: `You are UniBot, a formal AI assistant for UniBoard Admin Portal.
Help admins with user management, courses, fees, and university overview.`,
};

router.post("/chat", async (req, res) => {
  try {
    const { messages, role, context } = req.body;

    const basePrompt = systemPrompts[role] || systemPrompts.student;
    const fullPrompt = context ? `${basePrompt}\n\n${context}` : basePrompt;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          messages: [{ role: "system", content: fullPrompt }, ...messages],
        }),
      },
    );

    const data = await response.json();
    res.status(200).json({
      success: true,
      reply: data.choices?.[0]?.message?.content || "Sorry, try again.",
    });
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
