import express from "express";
import fetch from "node-fetch";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const app = express();

app.use(express.json());

app.post("/chat/completions", async (req, res) => {
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
          content: req.body?.message || "Hello chat, How are you",
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
    res.send(data?.choices[0].message?.content);
  } catch (error) {
    console.error(error);
  }
});

app.post("/genrate/image", async (req, res) => {
  const opt = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: req.body?.message || "A cute baby cat",
      n: 2,
      size: "1024x1024",
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      opt
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error(error);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("app is listen on port: " + PORT));
