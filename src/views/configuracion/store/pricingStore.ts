import { create } from 'zustand'
import type { PricingStore } from '../types'

export const usePricingStore = create<PricingStore>((set) => ({
    ciclopago: 'mensual',
    setCicloPago: (ciclo) => set({ ciclopago: ciclo }),
    dialogoPago: false,
    setDialogoPago: (open) => set({ dialogoPago: open }),
    planSeleccionado: {},
    setPlanSeleccionado: (plan) => set({ planSeleccionado: plan }),
}))