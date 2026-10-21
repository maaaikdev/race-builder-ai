Command - npx create-next-app@latest race builder-ai
    - Typescript Yes
    - ESLint Yes
    - Tailwind CSS Yes
    - src/ directiry Yes
    - App Router Yes

Command - npm install zod
Command - code .

Create folders - root project
    - src/specs
    - src/components
    - src/lib

Create files
    - src/specs/scheme.spec.ts
        - Paste code
    - src/specs/ui.spec.md
        - Paste instructions
    - src/specs/mock-race.ts
        - Paste code
    - app/page.tsx
        - Paste code

Test - npm run dev (http://localhost:3000)

Get API KEY - Gemini
    - Go to Google AI STudio
    - Clic option "Desarrolla con la API de Gemini"
    - To Find "Create API Key" button (botton - left)
    - On modal - Create project
    - Then copy API Key
    - Create race-builder-ai project a .env.local file on roor ptoject
        - GEMINI_API_KEY=
    - npm install @google/genai

Create Agent
    - lib/extractor-agent.ts
        - Paste agent code

Create API Router
    - app/api/extract/route.ts
        - Paste code
        - test with this command: 
            curl -X POST http://localhost:3000/api/extract \
                -H "Content-Type: application/json" \
                -d '{"text": "¡Atención atletas! Llega el Trail Guatavita 2026 en Cundinamarca el 20 de Octubre. Distancias 10K (cop 85000) y 21K (cop 120000). Salida desde el Parque Principal a las 6:00 AM. Inscripciones por Nequi al 3109876543. Organiza Guatavita Runners."}'

Create Admin Panel
    - app/admin/page.tsx
        - Paste code

