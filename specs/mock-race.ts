import { RaceSiteSpec } from './schema.spec';

export const mockRaceData: RaceSiteSpec = {
    meta: {
        slug: 'trail-del-cafe-2026',
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
    },
    raceInfo: {
        name: 'Trail del Café 2026',
        tagline: 'Conquista las montañas del Eje Cafetero',
        edition: '3ª Edición',
        discipline: 'TRAIL_RUNNING',
        eventDate: '2026-11-15',
        location: {
            city: 'Salento',
            departmentOrState: 'Quindío',
            country: 'Colombia',
            venueName: 'Plaza de Bolívar de Salento',
        },
        organizer: {
            name: 'Eje Trail Series',
            contactWhatsapp: '+573001234567',
            instagramHandle: '@ejetrailseries',
        },
    },
    branding: {
        primaryColorHex: '#10B981', // Verde esmeralda deportivo
        secondaryColorHex: '#18181B',
    },
    distances: [
        {
            id: '12k',
            name: '12K Reto Palmas',
            km: 12,
            elevationGain: 650,
            startTime: '07:00 AM',
            price: {
                amount: 95000,
                currency: 'COP',
                tierName: 'Lote 1',
            },
        },
        {
            id: '21k',
            name: '21K Media Maratón de Montaña',
            km: 21,
            elevationGain: 1200,
            startTime: '06:00 AM',
            price: {
                amount: 130000,
                currency: 'COP',
                tierName: 'Lote 1',
            },
        },
    ],
    registration: {
        status: 'OPEN',
        paymentMethod: 'WHATSAPP_MANUAL',
        manualPaymentDetails: {
            bankName: 'Nequi / Bancolombia',
            accountNumber: '3001234567',
            whatsappNumber: '573001234567',
        },
    },
};