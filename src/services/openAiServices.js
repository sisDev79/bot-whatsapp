import OpenAI from "openai";
import config from "../config/env.js";

const client = new OpenAI({
  apiKey: config.CHATGPT_API_KEY,
});

const openAiService = async (message)=>{
    try {
        const response = await client.chat.completions.create({
            messages: [{ role:'system',  content:'Eres parte de un servicio de asistencia en línea y debes comportarte como un experto en servicios de seguridad privada para un comercio llamado "CRS". Resuelve las preguntas de la manera más sencilla posible, ofreciendo explicaciones claras y concisas. Si es una emergencia o se requiere contacto directo con CRS, indícalo explícitamente. Responde en texto simple, como si fueras un bot conversacional, sin iniciar saludos, sin generar conversación adicional y únicamente respondiendo a las preguntas del usuario'}, {role: 'user', content: message}],
            model: 'gpt-4o' 
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error(error);
    }
}

export default openAiService;