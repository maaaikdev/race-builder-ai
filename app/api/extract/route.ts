import { NextResponse } from "next/server";
import { extractRaceFromText } from "@/lib/extractor-agent";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {

    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error:'Texto no válido'}, { status: 400 });
    }

    // 1. gemini procesa el texto
    const raceSpec = await extractRaceFromText(text);
    const slug = raceSpec.meta.slug;

    //2. Insertamos o actualizamos en Supabase
    const { error } = await supabase
        .from('races')
        .upsert({ slug, spec: raceSpec }, { onConflict: 'slug' });

    if(error) {
        console.error("Error al guardar en Supabase:", error);
        throw new Error(`Error BD: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: raceSpec,
    });
  } catch (error: any) {
    return NextResponse.json(
        { error: 'Error en el servidor', details: error.message },
        { status: 500 }
    )
  }
}