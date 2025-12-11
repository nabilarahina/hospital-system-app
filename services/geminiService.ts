import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AgentType, CoordinatorResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the Coordinator
const COORDINATOR_INSTRUCTION = `
You are the "Hospital System Coordinator". Your sole responsibility is to analyze user requests and route them to the correct sub-agent.
1. "Medical Information Agent": For questions about medical conditions, drugs, treatments, or general health.
2. "Appointment Scheduler Agent": For booking, rescheduling, or canceling appointments.
3. "Patient Management Agent": For updating patient records, admission, or discharge logic.
4. "Hospital Report Generator Agent": For generating administrative or operational reports.

Analyze the user input and return a JSON object indicating the target agent and a refined query.
`;

// Schema for the Coordinator's decision
const coordinatorSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    targetAgent: {
      type: Type.STRING,
      enum: [
        AgentType.MEDICAL_INFO,
        AgentType.APPOINTMENT,
        AgentType.PATIENT_MGMT,
        AgentType.REPORT_GEN,
      ],
      description: "The sub-agent best suited to handle the request.",
    },
    reasoning: {
      type: Type.STRING,
      description: "Brief explanation of why this agent was selected.",
    },
    refinedQuery: {
      type: Type.STRING,
      description: "The extracted core query to pass to the sub-agent.",
    },
  },
  required: ["targetAgent", "reasoning", "refinedQuery"],
};

export const classifyRequest = async (userQuery: string): Promise<CoordinatorResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userQuery,
      config: {
        systemInstruction: COORDINATOR_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: coordinatorSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as CoordinatorResponse;
    }
    throw new Error("No response from Coordinator");
  } catch (error) {
    console.error("Coordinator Error:", error);
    // Fallback to Medical Info if uncertain
    return {
      targetAgent: AgentType.MEDICAL_INFO,
      reasoning: "System error or ambiguity, defaulting to general info.",
      refinedQuery: userQuery,
    };
  }
};

export const getMedicalInfo = async (query: string): Promise<{ text: string; sources: any[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using flash for general queries, upgrade to 'gemini-3-pro-preview' if complex reasoning needed
      contents: query,
      config: {
        systemInstruction: `You are the "Medical Information Agent". 
        Your goal is to provide accurate, clear, and concise medical information.
        - Avoid complex jargon.
        - Be empathetic but professional.
        - Strictly use the provided tools to verify information.
        `,
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || "Source",
        uri: chunk.web?.uri || "#"
    })).filter((s: any) => s.uri !== "#") || [];

    return {
      text: response.text || "Maaf, saya tidak dapat menemukan informasi medis terkait saat ini.",
      sources: sources
    };
  } catch (error) {
    console.error("Medical Agent Error:", error);
    return {
      text: "Terjadi kesalahan saat menghubungi layanan medis. Silakan coba lagi nanti.",
      sources: []
    };
  }
};

export const mockAgentResponse = async (agentName: string, query: string): Promise<string> => {
  // Simulate other agents for this demo since they aren't fully specified in the prompt
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`[${agentName}] Menerima permintaan: "${query}". \n\n(Catatan: Ini adalah simulasi respons karena HTML asli hanya merinci Agen Informasi Medis secara mendalam.)`);
    }, 1000);
  });
};