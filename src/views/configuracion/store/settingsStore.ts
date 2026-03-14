import { create } from 'zustand'
import type { SettingsStore } from '../types'

export const useSettingsStore = create<SettingsStore>((set) => ({
    vistaActual: 'perfil',
    setVistaActual: (vista) => set({ vistaActual: vista }),
}))