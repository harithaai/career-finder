const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: "YOUR_API_KEY_HERE", // replace with your actual key
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error while processing your request");
  }
});

const port = 3000;
app.listen(port, function () {
  console.log("✅ Server running on http://localhost:" + port);
}); 