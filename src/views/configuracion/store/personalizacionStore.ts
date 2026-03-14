import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type EstiloRespuesta = 'formal' | 'neutral' | 'casual'
export type TonoRespuesta = 'conciso' | 'detallado' | 'educativo'

type PersonalizacionStore = {
    // Estilo y tono
    estiloRespuesta: EstiloRespuesta
    tonoRespuesta: TonoRespuesta
    setEstiloRespuesta: (estilo: EstiloRespuesta) => void
    setTonoRespuesta: (tono: TonoRespuesta) => void

    // Instrucciones personalizadas
    instruccionSistema: string
    instruccionUsuario: string
    setInstruccionSistema: (instruccion: string) => void
    setInstruccionUsuario: (instruccion: string) => void

    // Memoria
    memoriaActiva: boolean
    historialActivo: boolean
    setMemoriaActiva: (activa: boolean) => void
    setHistorialActivo: (activo: boolean) => void
}

export const usePersonalizacionStore = create<PersonalizacionStore>()(
    persist(
        (set) => ({
            estiloRespuesta: 'neutral',
            tonoRespuesta: 'detallado',
            setEstiloRespuesta: (estilo) => set({ estiloRespuesta: estilo }),
            setTonoRespuesta: (tono) => set({ tonoRespuesta: tono }),

            instruccionSistema: '',
            instruccionUsuario: '',
            setInstruccionSistema: (instruccion) => set({ instruccionSistema: instruccion }),
            setInstruccionUsuario: (instruccion) => set({ instruccionUsuario: instruccion }),

            memoriaActiva: false,
            historialActivo: false,
            setMemoriaActiva: (activa) => set({ memoriaActiva: activa }),
            setHistorialActivo: (activo) => set({ historialActivo: activo }),
        }),
        { name: 'personalizacion' }
    )
)