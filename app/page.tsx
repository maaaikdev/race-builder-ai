"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { RaceSiteSpec } from "../specs/schema.spec";

export default function CentralPortalPage() {
  const [races, setRaces] = useState<RaceSiteSpec[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");

  // Cargar las carreras registradas en Supabase al montar el componente
  useEffect(() => {
    async function loadRaces() {
      try {
        const { data, error } = await supabase
          .from("races")
          .select("spec")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error al obtener carreras de Supabase:", error);
        } else if (data) {
          const parsedRaces = data.map((item) => item.spec as RaceSiteSpec);
          setRaces(parsedRaces);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRaces();
  }, []);

  // Filtro dinámico por nombre/ciudad y disciplina
  const filteredRaces = races.filter((race) => {
    const matchesSearch =
      race.raceInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      race.raceInfo.location.city
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesDiscipline =
      selectedDiscipline === "ALL" ||
      race.raceInfo.discipline === selectedDiscipline;

    return matchesSearch && matchesDiscipline;
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Principal del Portal */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800 pb-8">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Directorio Deportivo Oficial
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight italic">
              Carreras de Colombia
            </h1>
            <p className="text-zinc-400 text-sm max-w-xl">
              Descubre tu próximo reto deportivo y realiza tu pre-inscripción
              directamente con los organizadores.
            </p>
          </div>

          <Link
            href="/admin"
            className="self-start md:self-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-wider text-xs rounded-2xl transition-transform active:scale-95 shadow-lg shadow-emerald-950/30 text-center"
          >
            ➕ Publicar mi Carrera Gratis ($0 COP)
          </Link>
        </header>

        {/* Barra de Filtros y Buscador */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900/60 p-4 border border-zinc-800 rounded-2xl">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o ciudad (ej: Suesca, Bogotá)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: "ALL", label: "Todas" },
              { id: "TRAIL_RUNNING", label: "Trail Running" },
              { id: "ROAD_RUNNING", label: "Calle" },
              { id: "HYROX", label: "Hyrox" },
            ].map((disc) => (
              <button
                key={disc.id}
                onClick={() => setSelectedDiscipline(disc.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  selectedDiscipline === disc.id
                    ? "bg-zinc-100 text-zinc-950"
                    : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {disc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grilla de Carreras */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-300">
            Próximos Eventos Destacados ({filteredRaces.length})
          </h2>

          {loading ? (
            <div className="text-center py-12 text-zinc-500 font-medium">
              Cargando calendario de carreras desde Supabase...
            </div>
          ) : filteredRaces.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800 rounded-2xl space-y-3">
              <p className="text-zinc-400 font-medium">
                No se encontraron carreras registradas.
              </p>
              <Link
                href="/admin"
                className="inline-block text-xs font-bold text-emerald-400 hover:underline uppercase"
              >
                Crea la primera carrera desde el Generador Agéntico →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRaces.map((race) => (
                <Link
                  key={race.meta.slug}
                  href={`/${race.meta.slug}`}
                  className="group bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 space-y-5 transition-all duration-200 hover:-translate-y-1 block"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span
                        className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full text-zinc-950"
                        style={{
                          backgroundColor:
                            race.branding.primaryColorHex || "#10B981",
                        }}
                      >
                        {race.raceInfo.discipline.replace("_", " ")}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">
                        📅 {race.raceInfo.eventDate}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-xl text-zinc-100 group-hover:text-white transition-colors">
                      {race.raceInfo.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {race.raceInfo.tagline}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                    <div className="text-xs text-zinc-400 flex items-center gap-1">
                      📍{" "}
                      <span>
                        {race.raceInfo.location.city},{" "}
                        {race.raceInfo.location.departmentOrState}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      ⛰️ Distancias:{" "}
                      <strong className="text-zinc-200">
                        {race.distances.map((d) => `${d.km}K`).join(" • ")}
                      </strong>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs font-bold text-emerald-400">
                    <span>Inscripciones Abiertas</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      Ver Evento →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
