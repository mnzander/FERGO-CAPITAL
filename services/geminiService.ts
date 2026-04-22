/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.0-flash',
    config: {
      systemInstruction: `Eres el asistente virtual de FERGO CAPITAL, la firma de Nagore Fernández. 
      Especialidad: Gestión de proyectos, branding y consultoría estratégica.
      
      Tone: Profesional, sofisticado, directo y visionario. Usa emojis como 💼, 📈, ✨, 🏢.
      
      Información Clave:
      - Nagore Fernández es la fundadora de FERGO CAPITAL y colabora estrechamente con Comeralia.
      - Proyectos Destacados: Comeralia (Software & Solutions), Porfolio Digital, y red estratégica en LinkedIn.
      - Valores: Innovación, Diseño de vanguardia y Resultados tangibles.
      
      Mantén las respuestas cortas (menos de 50 palabras). Si preguntan por Nagore, destaca su visión estratégica y su capacidad para liderar proyectos tecnológicos.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Systems offline. (Missing API Key)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmission interrupted.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost. Try again later.";
  }
};