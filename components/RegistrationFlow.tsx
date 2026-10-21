"use client";

import { useState } from "react";
import { RegistrationInfoSchema, DistanceSchema } from "../specs/schema.spec";
import { z } from "zod";

type RegistrationInfo = z.infer<typeof RegistrationInfoSchema>;
type Distance = z.infer<typeof DistanceSchema>;

interface RegistrationFlowProps {
  registration: RegistrationInfo;
  selectedDistance: Distance | null;
  organizerWhatsapp?: string;
  primaryColorHex: string;
  onClose: () => void;
}

export function RegistrationFlow({
  registration,
  selectedDistance,
  organizerWhatsapp,
  primaryColorHex,
  onClose,
}: RegistrationFlowProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    documentId: "",
    shirtSize: "M",
    phone: "",
  });

  if (!selectedDistance) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reservationCode = `REG-${Math.floor(1000 + Math.random() * 9000)}`;

    const message = `👋 ¡Hola! Quiero confirmar mi inscripción a la carrera:

📌 *Distancia:* ${selectedDistance.name}
👤 *Atleta:* ${formData.fullName}
🆔 *Cédula:* ${formData.documentId}
👕 *Talla:* ${formData.shirtSize}
🔢 *Código de Registro:* #${reservationCode}
💰 *Valor:* $${selectedDistance.price.amount.toLocaleString("es-CO")} COP

Adjunto mi comprobante de pago por Nequi/Daviplata.`;

    const targetPhone =
      registration.manualPaymentDetails?.whatsappNumber ||
      organizerWhatsapp ||
      "";
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 relative shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Pre-Inscripción Oficial
            </span>
            <h3 className="text-2xl font-black uppercase text-zinc-100">
              {selectedDistance.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 text-xl font-bold bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
              Nombre Completo
            </label>
            <input
              required
              type="text"
              placeholder="Ej: Camilo Torres"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                Cédula / Documento
              </label>
              <input
                required
                type="text"
                placeholder="1098765432"
                value={formData.documentId}
                onChange={(e) =>
                  setFormData({ ...formData, documentId: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                Talla Camiseta
              </label>
              <select
                value={formData.shirtSize}
                onChange={(e) =>
                  setFormData({ ...formData, shirtSize: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
          </div>

          {registration.manualPaymentDetails && (
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 space-y-2 text-xs text-zinc-300">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                Método de Pago:
              </span>
              <p>
                🏦 Banco:{" "}
                <strong>{registration.manualPaymentDetails.bankName}</strong>
              </p>
              <p>
                📱 Número de Cuenta:{" "}
                <strong>
                  {registration.manualPaymentDetails.accountNumber}
                </strong>
              </p>
              <p className="text-zinc-500 pt-1">
                Transfiere el valor de $
                {selectedDistance.price.amount.toLocaleString("es-CO")} COP
                antes de enviar tu registro.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-wider text-zinc-950 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: primaryColorHex }}
          >
            Confirmar y Enviar por WhatsApp 📲
          </button>
        </form>
      </div>
    </div>
  );
}
