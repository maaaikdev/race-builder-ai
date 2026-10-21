import { DistanceSchema } from "../specs/schema.spec";
import { z } from "zod";

type Distance = z.infer<typeof DistanceSchema>;

interface DistanceCardProps {
  distance: Distance;
  primaryColorHex: string;
  onSelect?: (distance: Distance) => void;
}

export function DistanceCard({
  distance,
  primaryColorHex,
  onSelect,
}: DistanceCardProps) {
  return (
    <div className="group relative bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-extrabold text-xl text-zinc-100 group-hover:text-white transition-colors">
              {distance.name}
            </h3>
            {distance.startTime && (
              <p className="text-xs font-medium text-zinc-400 mt-1">
                ⏱️ Hora de salida:{" "}
                <span className="text-zinc-200">{distance.startTime}</span>
              </p>
            )}
          </div>
          <span className="text-3xl font-black tracking-tight text-zinc-100">
            {distance.km}
            <span className="text-sm font-bold text-zinc-500">KM</span>
          </span>
        </div>

        {distance.elevationGain !== undefined && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800/60 border border-zinc-700/40 rounded-lg text-xs font-bold text-zinc-300">
            <span className="text-emerald-400">▲</span>
            <span>+{distance.elevationGain}m Desnivel Positivo</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-4">
        <div>
          {distance.price.tierName && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              {distance.price.tierName}
            </span>
          )}
          <span className="text-2xl font-black text-zinc-100">
            ${distance.price.amount.toLocaleString("es-CO")}
            <span className="text-xs font-bold text-zinc-500 ml-1">
              {distance.price.currency}
            </span>
          </span>
        </div>

        <button
          onClick={() => onSelect && onSelect(distance)}
          className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-zinc-950 transition-transform active:scale-95 hover:opacity-90 shadow-md"
          style={{ backgroundColor: primaryColorHex }}
        >
          Seleccionar
        </button>
      </div>
    </div>
  );
}
