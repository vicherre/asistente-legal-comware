
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { messages, email } = req.body;

  if (!messages || !email) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres CORA, el asistente legal de Comware. Respondes con precisión, lenguaje profesional y apoyas a usuarios en sus tareas legales diarias. Tienes acceso a documentos legales en SharePoint y conocimiento experto de derecho corporativo."
        },
        ...messages
      ],
      temperature: 0.3
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error GPT:", error);
    res.status(500).json({ error: "Error al generar respuesta" });
  }
}
