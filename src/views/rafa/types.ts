export type Vista = 'perfil' | 'facturacion' | 'tema'
export type CiclosPago = 'mensual' | 'anual'

export type SettingsStore = {
    vistaActual: Vista
    setVistaActual: (vista: Vista) => void
}

export type PricingStore = {
    ciclopago: CiclosPago
    setCicloPago: (ciclo: CiclosPago) => void
    dialogoPago: boolean
    setDialogoPago: (open: boolean) => void
    planSeleccionado: Partial<PlanSeleccionado>
    setPlanSeleccionado: (plan: Partial<PlanSeleccionado>) => void
}

export type PlanSeleccionado = {
    ciclopago: CiclosPago
    nombrePlan: string
    precio: Record<CiclosPago, number>
}

export type EsquemaPerfil = {
    nombre: string
    apellido: string
    email: string
    codigoArea: string
    telefono: string
    img: string
    pais: string
    direccion: string
    codigoPostal: string
    ciudad: string
}

export type OpcionPais = {
    label: string
    dialCode: string
    value: string
}

export type TarjetaCredito = {
    cardId: string
    cardType: 'VISA' | 'MASTER'
    cardHolderName: string
    last4Number: string
    expMonth: string
    expYear: string
    primary: boolean
}

export type Transaccion = {
    id: string
    fecha: number
    monto: number
    estado: string
    descripcion: string
}

export type DatosFacturacion = {
    planActual: {
        plan: string
        estado: string
        cicloFacturacion: string
        proximoPago: number | null
        monto: number | null
    }
    metodosPago: TarjetaCredito[]
    historialTransacciones: Transaccion[]
}

export type Plan = {
    id: string
    nombre: string
    descripcion: string
    recomendado: boolean
    precio: Record<CiclosPago, number>
    caracteristicas: string[]
}