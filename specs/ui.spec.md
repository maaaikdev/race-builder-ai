# ESPECIFICACIÓN TÉCNICA DE UI Y COMPONENTES (`ui.spec.md`)

## 1. Reglas Generales

- **Framework:** Tailwind CSS.
- **Tema:** Dark mode por defecto (`bg-zinc-950 text-zinc-100`).
- **Tipografía:** Encabezados con `font-black uppercase tracking-tight` para dar sensación deportiva.
- **Responsividad:** Mobile-first obligatorio.

## 2. Componentes de la Landing Page

- `<HeroSection />`: Banner principal con título, tagline, fecha, ubicación y botón CTA de inscripción.
- `<CountdownTimer />`: Reloj regresivo en Vivo (Días, Horas, Minutos, Segundos).
- `<DistanceCard />`: Tarjeta con kilometraje, desnivel positivo (+m), precio y botón de pre-registro.
- `<RegistrationModal />`: Formulario que captura Nombre, Cédula, Talla y WhatsApp antes de pagar o enviar comprobante.
- `<ScheduleTimeline />`: Cronograma del evento.

## 3. Componentes del Portal Central

- `<PortalHeader />`: Buscador global y filtros por Disciplina, Ciudad y Mes.
- `<EventCardMini />`: Tarjeta corta de catálogo para listar la carrera en el directorio general.
