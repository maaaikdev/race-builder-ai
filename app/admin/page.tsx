"use client";

import { useState } from "react";
import { RaceSiteSpec } from "@/specs/schema.spec";

export default function AdminPage() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<RaceSiteSpec | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.details || result.error || "Error al procesar el texto");
      }

      setExtractedData(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Admin */}
        <header className="border-b border-zinc-800 pb-4">
          <h1 className="text-3xl font-black uppercase tracking-tight text-emerald-400">
            Race Builder AI — Generador Agéntico
          </h1>
          <p className="text-zinc-400 text-sm">
            Pega el texto, afiche o WhatsApp de la carrera para extraer los
            datos y generar la web.
          </p>
        </header>

        {/* Formulario de Entrada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase text-zinc-300">
              Información Raw de la Carrera (WhatsApp / PDF / Copia)
            </label>
            <textarea
              rows={10}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              placeholder="Ej: ¡Llega la Ultra Trail Montserrat 2026! Distancias 15K ($90.000) y 30K ($140.000). Pago por Nequi al 3123456789..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={handleExtract}
              disabled={loading || !inputText.trim()}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 font-bold text-zinc-950 rounded-xl transition-all"
            >
              {loading
                ? "🤖 Agente Extrayendo Datos..."
                : "⚡ Generar Spec con Gemini Flash"}
            </button>

            {error && (
              <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 rounded-xl text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Vista Previa del JSON Extraído */}
          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase text-zinc-300">
              Spec Validado (`schema.spec.ts`)
            </label>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-[320px] overflow-auto text-xs font-mono text-emerald-400">
              {extractedData ? (
                <pre>{JSON.stringify(extractedData, null, 2)}</pre>
              ) : (
                <span className="text-zinc-600">
                  Esperando extracción de datos... El JSON validado aparecerá
                  aquí.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Vista Previa en Vivo si hay datos */}
        {extractedData && (
          <section className="pt-8 border-t border-zinc-800 space-y-4">
            <h2 className="text-xl font-bold uppercase text-emerald-400">
              Vista Previa de la Landing Page Generada
            </h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div>
                <span
                  className="inline-block px-3 py-1 text-xs font-bold uppercase rounded-full text-zinc-950"
                  style={{
                    backgroundColor: extractedData.branding.primaryColorHex,
                  }}
                >
                  {extractedData.raceInfo.discipline} •{" "}
                  {extractedData.raceInfo.edition}
                </span>
                <h3 className="text-3xl font-black uppercase mt-2">
                  {extractedData.raceInfo.name}
                </h3>
                <p className="text-zinc-400">
                  {extractedData.raceInfo.tagline}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  📍 {extractedData.raceInfo.location.city},{" "}
                  {extractedData.raceInfo.location.departmentOrState} | 📅{" "}
                  {extractedData.raceInfo.eventDate}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {extractedData.distances.map((dist) => (
                  <div
                    key={dist.id}
                    className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{dist.name}</span>
                      <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-emerald-400 font-mono">
                        ${dist.price.amount.toLocaleString("es-CO")}{" "}
                        {dist.price.currency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
