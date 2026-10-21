import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RaceSiteSpec } from "../specs/schema.spec";

// Inicializar el SDK de Gemini con la API Key del entorno
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * ESQUEMA DE SALIDA ESTRUCTURADA (JSON Schema para Gemini)
 * Le enseñamos a Gemini exactamente el contrato que debe cumplir.
 */
const raceSiteJsonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    meta: {
      type: Type.OBJECT,
      properties: {
        slug: {
          type: Type.STRING,
          description:
            "Slug amigable único en minúsculas y guiones (ej: trail-los-andes-2026)",
        },
        generatedAt: { type: Type.STRING },
        version: { type: Type.STRING },
      },
      required: ["slug"],
    },
    raceInfo: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Nombre oficial del evento" },
        tagline: {
          type: Type.STRING,
          description: "Slogan o frase de impacto corta",
        },
        edition: {
          type: Type.STRING,
          description: "Ej: 1ª Edición, Edición 2026",
        },
        discipline: {
          type: Type.STRING,
          enum: ["TRAIL_RUNNING", "ROAD_RUNNING", "HYROX", "TRIATHLON"],
          description: "Disciplina deportiva principal",
        },
        eventDate: {
          type: Type.STRING,
          description: "Fecha principal YYYY-MM-DD",
        },
        location: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            departmentOrState: { type: Type.STRING },
            country: { type: Type.STRING },
            venueName: {
              type: Type.STRING,
              description: "Lugar exacto de salida / meta",
            },
          },
          required: ["city", "departmentOrState", "venueName"],
        },
        organizer: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            contactWhatsapp: { type: Type.STRING },
            instagramHandle: { type: Type.STRING },
          },
          required: ["name"],
        },
      },
      required: [
        "name",
        "tagline",
        "edition",
        "discipline",
        "eventDate",
        "location",
        "organizer",
      ],
    },
    branding: {
      type: Type.OBJECT,
      properties: {
        primaryColorHex: {
          type: Type.STRING,
          description: "Color principal dinámico en HEX (ej: #FF5722)",
        },
        secondaryColorHex: {
          type: Type.STRING,
          description: "Color de fondo en HEX (ej: #18181B)",
        },
      },
      required: ["primaryColorHex", "secondaryColorHex"],
    },
    distances: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Identificador corto ej: 10k" },
          name: {
            type: Type.STRING,
            description: "Nombre visible ej: 10K Recreativa",
          },
          km: {
            type: Type.NUMBER,
            description: "Distancia numérica en kilómetros",
          },
          elevationGain: {
            type: Type.NUMBER,
            description: "Desnivel positivo en metros",
          },
          startTime: {
            type: Type.STRING,
            description: "Hora de salida ej: 07:00 AM",
          },
          price: {
            type: Type.OBJECT,
            properties: {
              amount: {
                type: Type.NUMBER,
                description: "Valor numérico de la inscripción en COP",
              },
              currency: { type: Type.STRING },
              tierName: {
                type: Type.STRING,
                description: "Ej: Preventa, Lote Único",
              },
            },
            required: ["amount", "currency"],
          },
        },
        required: ["id", "name", "km", "price"],
      },
    },
    registration: {
      type: Type.OBJECT,
      properties: {
        status: {
          type: Type.STRING,
          enum: ["OPEN", "CLOSED", "SOON", "LAST_SPOTS"],
        },
        paymentMethod: {
          type: Type.STRING,
          enum: ["GATEWAY", "WHATSAPP_MANUAL", "HYBRID"],
        },
        manualPaymentDetails: {
          type: Type.OBJECT,
          properties: {
            bankName: { type: Type.STRING },
            accountNumber: { type: Type.STRING },
            whatsappNumber: { type: Type.STRING },
          },
        },
      },
      required: ["status", "paymentMethod"],
    },
  },
  required: ["meta", "raceInfo", "branding", "distances", "registration"],
};

/**
 * AGENTE EXTRACTOR
 * Lee un texto desestructurado (WhatsApp, PDF, folleto) y devuelve un objeto RaceSiteSpec estricto.
 */
export async function extractRaceFromText(
  rawText: string,
): Promise<RaceSiteSpec> {
  // Modelos candidatos en orden de intento
  const candidateModels = [
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-3.6-flash",
    "gemini-3.8-flash"
  ];

  let lastError: any = null;

  const promptContents = `Extrae la información estructurada del siguiente texto de carrera deportiva en Colombia.

    REGLAS DE EXTRACCIÓN:
    1. Si no encuentras el departamento, infiérelo por la ciudad (ej: Bogotá -> Cundinamarca, Suesca -> Cundinamarca).
    2. Si el texto no menciona distancias o precios, crea al menos una distancia por defecto (ej: "5K Recreativa", 5km, $50.000 COP).
    3. Si el texto de la distancia viene en km, pásalo a km (ej: 10km -> 10k). Si viene en metros, conviértelo a km (ej: 5000m -> 5k). Si viene en millas, conviértelo a km.
    4. Si no hay organizador o contacto especificado, usa "Organización del evento".
    5. Asigna un color deportivo vibrante en HEX (#10B981, #FF5722, #3B82F6).

    TEXTO DEL EVENTO:
    """
    ${rawText}
    """`;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: promptContents,
        config: {
          responseMimeType: "application/json",
          responseSchema: raceSiteJsonSchema,
          temperature: 0.2,
        },
      });

      const jsonText = response.text;
      if (jsonText) {
        return JSON.parse(jsonText) as RaceSiteSpec;
      }
    } catch (err: any) {
      console.warn(
        `Error con ${modelName}, reintentando con el siguiente modelo...`,
        err,
      );
      lastError = err;
    }
  }

  throw new Error(
    `No se pudo procesar la información con ningún modelo de la IA. Detalle: ${lastError?.message || "Error desconocido"}`,
  );
}
