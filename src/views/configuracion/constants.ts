import dayjs from 'dayjs'
import type { Plan, DatosFacturacion } from './types'

export const mesesAbrev = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

export const planesDisponibles: Plan[] = [
    {
        id: 'basico',
        nombre: 'Básico',
        descripcion: 'Perfecto para empezar',
        recomendado: false,
        precio: { mensual: 9.99, anual: 99.99 },
        caracteristicas: ['acceso_basico', 'soporte_email', '1_usuario'],
    },
    {
        id: 'pro',
        nombre: 'Pro',
        descripcion: 'Para equipos en crecimiento',
        recomendado: true,
        precio: { mensual: 29.99, anual: 299.99 },
        caracteristicas: ['acceso_basico', 'soporte_email', 'soporte_prioritario', '5_usuarios', 'reportes'],
    },
    {
        id: 'empresarial',
        nombre: 'Empresarial',
        descripcion: 'Para grandes organizaciones',
        recomendado: false,
        precio: { mensual: 79.99, anual: 799.99 },
        caracteristicas: ['acceso_basico', 'soporte_email', 'soporte_prioritario', 'soporte_24_7', 'usuarios_ilimitados', 'reportes', 'api_acceso'],
    },
]

export const listaCaracteristicas = [
    { id: 'acceso_basico',       descripcion: 'Acceso básico a la plataforma' },
    { id: 'soporte_email',       descripcion: 'Soporte por correo electrónico' },
    { id: 'soporte_prioritario', descripcion: 'Soporte prioritario' },
    { id: 'soporte_24_7',        descripcion: 'Soporte 24/7' },
    { id: '1_usuario',           descripcion: '1 usuario' },
    { id: '5_usuarios',          descripcion: 'Hasta 5 usuarios' },
    { id: 'usuarios_ilimitados', descripcion: 'Usuarios ilimitados' },
    { id: 'reportes',            descripcion: 'Reportes avanzados' },
    { id: 'api_acceso',          descripcion: 'Acceso a API' },
]

export const mockFacturacion: DatosFacturacion = {
    planActual: {
        plan: 'Modo Full',
        estado: 'activo',
        cicloFacturacion: 'mensual',
        proximoPago: dayjs().add(30, 'day').unix(),
        monto: 29.99,
    },
    metodosPago: [
        {
            cardId: '1',
            cardType: 'VISA',
            cardHolderName: 'John Doe',
            last4Number: '4242',
            expMonth: '12',
            expYear: '26',
            primary: true,
        },
    ],
    historialTransacciones: [
        { id: '1', fecha: dayjs().subtract(1, 'month').unix(), monto: 29.99, estado: 'Pagado', descripcion: 'Modo Full - Mensual' },
        { id: '2', fecha: dayjs().subtract(2, 'month').unix(), monto: 29.99, estado: 'Pagado', descripcion: 'Modo Full - Mensual' },
        { id: '3', fecha: dayjs().subtract(3, 'month').unix(), monto: 29.99, estado: 'Pagado', descripcion: 'Modo Full - Mensual' },
    ],
}

export function limit(val: string, max: string) {
    if (val.length === 1 && val[0] > max[0]) val = '0' + val
    if (val.length === 2) {
        if (Number(val) === 0) val = '01'
        else if (val > max) val = max
    }
    return val
}

export function cardExpiryFormat(val: string) {
    const month = limit(val.substring(0, 2), '12')
    const date  = limit(val.substring(2, 4), '31')
    return month + (date.length ? '/' + date : '')
}