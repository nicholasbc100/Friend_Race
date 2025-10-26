import { GoogleGenAI, Modality } from "@google/genai";

export const extractFace = async (
  base64ImageData: string,
  mimeType: string,
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: 'Identify the most prominent human face in this image. Return a new image that is a tight, circular crop of just that face. The background of the new image must be transparent.',
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("No face image data found in the API response. Please try a different photo.");

  } catch (error) {
    console.error("Error extracting face with Gemini:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract face: ${error.message}`);
    }
    throw new Error("An unknown error occurred while extracting the face.");
  }
};
