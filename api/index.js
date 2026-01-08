// import express from "express";
// import fetch from "node-fetch";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post("/api/analyze", async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt required" });
//     }

//     const openaiRes = await fetch("https://api.openai.com/v1/responses", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "gpt-4.1-mini",
//         input: prompt,
//         max_output_tokens: 2000,
//       }),
//     });

//     if (!openaiRes.ok) {
//       const errorText = await openaiRes.text();
//       console.error("OpenAI error:", errorText);
//       return res.status(500).json({ error: "OpenAI request failed" });
//     }

//     const data = await openaiRes.json();

//     const text = data.output
//       ?.flatMap((o) => o.content || [])
//       ?.filter((c) => c.type === "output_text")
//       ?.map((c) => c.text)
//       ?.join("\n");

//     res.json({ text });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to analyze dream" });
//   }
// });

// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`API server running on http://localhost:${PORT}`);
// });
