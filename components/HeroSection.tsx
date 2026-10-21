import { RaceSiteSpec } from "../specs/schema.spec";

interface HeroSectionProps {
  raceInfo: RaceSiteSpec["raceInfo"];
  branding: RaceSiteSpec["branding"];
}

export function HeroSection({ raceInfo, branding }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 md:p-14">
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: branding.primaryColorHex }}
      />

      <div className="relative z-10 max-w-3xl space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="px-3 py-1 text-xs font-black uppercase rounded-full text-zinc-950 tracking-wider"
            style={{ backgroundColor: branding.primaryColorHex }}
          >
            {raceInfo.discipline.replace("_", " ")}
          </span>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest bg-zinc-800/80 px-3 py-1 rounded-full border border-zinc-700/50">
            {raceInfo.edition}
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-zinc-100 italic">
            {raceInfo.name}
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">
            {raceInfo.tagline}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-zinc-300 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>
              {raceInfo.location.city}, {raceInfo.location.departmentOrState}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>🏁</span>
            <span>{raceInfo.location.venueName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{raceInfo.eventDate}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
