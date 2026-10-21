"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "../../lib/supabase";
import { HeroSection } from "../../components/HeroSection";
import { DistanceCard } from "../../components/DistanceCard";
import { RegistrationFlow } from "../../components/RegistrationFlow";
import { RaceSiteSpec, DistanceSchema } from "../../specs/schema.spec";
import { z } from "zod";

type Distance = z.infer<typeof DistanceSchema>;

export default function RaceLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [raceData, setRaceData] = useState<RaceSiteSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDistance, setSelectedDistance] = useState<Distance | null>(
    null,
  );

  useEffect(() => {
    async function fetchRace() {
      const { data, error } = await supabase
        .from("races")
        .select("spec")
        .eq("slug", resolvedParams.slug)
        .single();

      if (data && !error) {
        setRaceData(data.spec as RaceSiteSpec);
      }
      setLoading(false);
    }

    fetchRace();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-sans">
        Cargando sitio web oficial de la carrera...
      </div>
    );
  }

  if (!raceData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-sans">
        Carrera no encontrada en el sistema.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-10">
      <div className="max-w-5xl mx-auto space-y-12">
        <nav className="flex justify-between items-center pb-4 border-b border-zinc-800/80">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Sitio Web Oficial • {raceData.raceInfo.organizer.name}
          </span>
          <a
            href="/"
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-100"
          >
            ← Volver al Calendario
          </a>
        </nav>

        <HeroSection
          raceInfo={raceData.raceInfo}
          branding={raceData.branding}
        />

        <section className="space-y-6">
          <h2 className="text-2xl font-black uppercase text-zinc-100 italic">
            Distancias y Categorías
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {raceData.distances.map((dist) => (
              <DistanceCard
                key={dist.id}
                distance={dist}
                primaryColorHex={raceData.branding.primaryColorHex}
                onSelect={(d) => setSelectedDistance(d)}
              />
            ))}
          </div>
        </section>
      </div>

      {selectedDistance && (
        <RegistrationFlow
          registration={raceData.registration}
          selectedDistance={selectedDistance}
          organizerWhatsapp={raceData.raceInfo.organizer.contactWhatsapp}
          primaryColorHex={raceData.branding.primaryColorHex}
          onClose={() => setSelectedDistance(null)}
        />
      )}
    </main>
  );
}
