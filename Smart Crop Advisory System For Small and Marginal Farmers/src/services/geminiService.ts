import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const getCropRecommendation = async (soil: any, weather: any, lang: string) => {
  const prompt = `As an expert agricultural scientist, recommend the best crop for a farmer with the following conditions:
  Soil Type: ${soil.type}
  pH Level: ${soil.ph}
  Nitrogen: ${soil.nitrogen}
  Phosphorus: ${soil.phosphorus}
  Potassium: ${soil.potassium}
  Soil Moisture: ${soil.moisture}%
  Current Weather: ${weather.temp}°C, ${weather.humidity}% humidity, ${weather.description}
  Location: ${weather.city}
  
  Please provide the recommendation in ${lang} language.
  Include:
  1. Recommended Crop
  2. Why this crop?
  3. Expected Yield (per acre)
  4. Fertilizer advice
  5. Irrigation schedule
  
  Format the response as a structured markdown.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
};

export const detectPlantDisease = async (base64Image: string, lang: string) => {
  const prompt = `Analyze this plant image and:
  1. Identify the plant.
  2. Detect any diseases or pests.
  3. Suggest organic and chemical treatments.
  4. Provide prevention tips.
  
  Please provide the response in ${lang} language.
  Format the response as a structured markdown.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: prompt }
      ]
    },
  });

  return response.text;
};

export const getIrrigationAdvice = async (soil: any, weather: any, lang: string) => {
  const prompt = `As an irrigation specialist, provide advice for a farm with:
  Soil Type: ${soil.type}
  Soil Moisture: ${soil.moisture}%
  Current Weather: ${weather.temp}°C, ${weather.humidity}% humidity, ${weather.description}
  Forecast: ${JSON.stringify(weather.forecast)}
  
  Please provide:
  1. When to irrigate next?
  2. How much water (liters per acre)?
  3. Best irrigation method (Drip, Sprinkler, etc.)
  
  Provide response in ${lang} language in structured markdown.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
};

export const monitorCropGrowth = async (base64Image: string, lang: string) => {
  const prompt = `Analyze this field image and:
  1. Identify the crop and its current growth stage.
  2. Assess the overall health status.
  3. Identify any visible nutrient deficiencies or water stress.
  4. Predict the time remaining for harvest.
  
  Please provide the response in ${lang} language.
  Format the response as a structured markdown.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: prompt }
      ]
    },
  });

  return response.text;
};

export const getSoilAnalysis = async (soil: any, lang: string) => {
  const prompt = `As a soil scientist, analyze the following soil test results:
  Soil Type: ${soil.type}
  pH Level: ${soil.ph}
  Nitrogen (N): ${soil.nitrogen}
  Phosphorus (P): ${soil.phosphorus}
  Potassium (K): ${soil.potassium}
  Soil Moisture: ${soil.moisture}%
  
  Please provide:
  1. Overall Soil Health Status (Excellent, Good, Fair, Poor)
  2. Nutrient Deficiency Analysis
  3. Fertilizer Recommendations (Specific types and amounts)
  4. Organic Amendment Suggestions (Compost, Manure, etc.)
  5. pH Correction Advice (if needed)
  
  Provide response in ${lang} language in structured markdown.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
};

export const getChatbotResponse = async (message: string, context: any, lang: string) => {
  const prompt = `You are KrishiSathi, a helpful AI assistant for small and marginal farmers. 
  Current context: ${JSON.stringify(context)}
  User question: ${message}
  
  Provide a helpful, practical, and easy-to-understand answer in ${lang} language.
  If the user asks about fertilizers, suggest specific ones based on their soil if available.
  If they ask about weather, use the provided context.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
};

export const getRainProbability = async (temp: number, humidity: number, city: string, lang: string) => {
  const prompt = `As a meteorologist, estimate the probability of rain for a location with the following conditions:
  City: ${city}
  Temperature: ${temp}°C
  Humidity: ${humidity}%
  
  Provide the response in ${lang} language.
  Return a JSON object with:
  1. probability: (number, 0-100)
  2. reasoning: (string, brief explanation of why this probability was chosen based on the conditions)
  3. advice: (string, brief advice for the farmer based on the rain probability)
  
  Only return the JSON object.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", response.text);
    return { probability: 15, reasoning: "Default estimate", advice: "Keep monitoring weather." };
  }
};
