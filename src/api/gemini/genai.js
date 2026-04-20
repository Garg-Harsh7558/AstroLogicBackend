import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey:process.env.gemini_api_key});
const model=["gemini-3.1-flash-preview","gemini-3-flash-preview","gemini-3.1-flash-lite","gemini-1.5-pro","gemini-1.5-flash","gemini-1.5-pro-002","gemini-1.5-flash-002","gemini-3-experimental","gemini-3-ultra-preview"];



export async function main(prompt) {
  // Loop through your models array
  for (let i = 0; i < model.length; i++) {
    try {
      console.log(`Attempting with: ${model[i]}...`);
      
      const response = await ai.models.generateContent({
        model: model[i],
        contents: `${prompt}`,
      });
        
      // If successful, log and return the text
      console.log(`Success with ${model[i]}!`);
      // Optional chaining (?. ) makes this safe from crashing
      const text = response.text;
      return text || "The cosmic energy is low. Please try your question again."; 

    } catch (error) {
      console.warn(`${model[i]} failed. Error: ${error.message}`);
      
      if (i === model.length - 1) {
        console.error("All models failed.");
        throw new Error("AI generation failed for all models");
      }
    }
  }
}