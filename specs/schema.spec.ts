import { z } from 'zod';

/**
* ESPECIFICACIÓN TÉCNICA DE DATOS: EVENTO DEPORTIVO
* Este esquema define la estructura requerida para la generación automática
* del sitio web de la carrera (Spec-Driven Development).
*/

export const DistanceSchema = z.object({
    id: z.string().describe('Identificador único slug (ej: 10k, 21k)'),
    name: z.string().describe('Nombre visible de la distancia (ej: "21K Misión Montaña")'),
    km: z.number().positive().describe('Distancia en kilómetros'),
    elevationGain: z.number().nonnegative().optional().describe('Desnivel positivo en metros (+m)'),
    startTime: z.string().optional().describe('Hora de salida (ej: "06:00 AM")'),
    minAge: z.number().optional().describe('Edad mínima requerida'),
    price: z.object({
        amount: z.number().positive(),
        currency: z.string().default('COP'),
        tierName: z.string().optional().describe('Nombre de la etapa (ej: "Preventa", "Lote 1")'),
    }),
});

export const RegistrationInfoSchema = z.object({
    status: z.enum(['OPEN', 'CLOSED', 'SOON', 'LAST_SPOTS']).describe('Estado de inscripciones'),
    paymentMethod: z.enum(['GATEWAY', 'WHATSAPP_MANUAL', 'HYBRID']).default('WHATSAPP_MANUAL'),
    registrationUrl: z.string().optional().describe('Link a la pasarela o link a WhatsApp'),
    manualPaymentDetails: z.object({
        bankName: z.string().optional().describe('ej: Nequi / Bancolombia'),
        accountNumber: z.string().optional(),
        whatsappNumber: z.string().optional(),
    }).optional(),
    deadline: z.string().optional().describe('Fecha límite (Formato YYYY-MM-DD)'),
    maxSlots: z.number().positive().optional(),
});

export const EventScheduleSchema = z.object({
    time: z.string().describe('Rango de tiempo (ej: "08:00 AM - 12:00 PM")'),
    activity: z.string().describe('Nombre de la actividad'),
    locationName: z.string().describe('Lugar específico'),
});

export const RaceSiteSpecSchema = z.object({
    meta: z.object({
        slug: z.string().describe('URL amigable (ej: "trail-los-andes-2026")'),
        generatedAt: z.string().default(() => new Date().toISOString()),
        version: z.string().default('1.0.0'),
    }),
    raceInfo: z.object({
        name: z.string().describe('Nombre oficial de la carrera'),
        tagline: z.string().describe('Frase de impacto corta'),
        edition: z.string().describe('Año o número de edición'),
        discipline: z.enum(['TRAIL_RUNNING', 'ROAD_RUNNING', 'HYROX', 'TRIATHLON']).describe('Disciplina deportiva'),
        eventDate: z.string().describe('Fecha principal (Formato YYYY-MM-DD)'),
        location: z.object({
            city: z.string(),
            departmentOrState: z.string(),
            country: z.string().default('Colombia'),
            venueName: z.string(),
            coordinatesUrl: z.string().optional(),
        }),
        organizer: z.object({
            name: z.string(),
            contactEmail: z.string().optional(),
            contactWhatsapp: z.string().optional(),
            instagramHandle: z.string().optional(),
        }),
    }),
    branding: z.object({
        primaryColorHex: z.string().regex(/^#([A-Fa-f0-9]{6})$/).default('#FF5722'),
        secondaryColorHex: z.string().regex(/^#([A-Fa-f0-9]{6})$/).default('#1A1A1A'),
        logoUrl: z.string().optional(),
        heroImageUrl: z.string().optional(),
    }),
    distances: z.array(DistanceSchema).min(1),
    registration: RegistrationInfoSchema,
    schedule: z.array(EventScheduleSchema).optional(),
    sponsors: z.array(
        z.object({
            name: z.string(),
            logoUrl: z.string().optional(),
            tier: z.enum(['MAIN', 'GOLD', 'SILVER', 'MEDIA_PARTNER']).optional(),
        })
    ).optional(),
});

export type RaceSiteSpec = z.infer<typeof RaceSiteSpecSchema>