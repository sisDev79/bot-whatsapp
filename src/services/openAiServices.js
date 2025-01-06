import OpenAI from "openai";
import config from "../config/env.js";

const client = new OpenAI({
  apiKey: config.CHATGPT_API_KEY,
});

const openAiService = async (message)=>{
    try {
        const response = await client.chat.completions.create({
            messages: [{ role:'system',  content:'prompt'}, {role: 'user', content: message}],
            model: 'gpt-4o' 
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error(error);
    }
}

export default openAiService;