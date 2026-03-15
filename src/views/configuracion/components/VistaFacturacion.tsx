import { useState } from 'react'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import { TbPlus } from 'react-icons/tb'
import { PiLightningFill } from 'react-icons/pi'
import { NumericFormat } from 'react-number-format'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import dayjs from 'dayjs'
import { mockFacturacion, mesesAbrev } from '../constants'
import VistaCambiarPlan from './VistaCambiarPlan'

const VistaFacturacion = () => {
    const [mostrarPlanes, setMostrarPlanes] = useState(false)
    const datos = mockFacturacion

    if (mostrarPlanes) {
        return <VistaCambiarPlan onVolver={() => setMostrarPlanes(false)} />
    }

    return (
        <div>
            <h4 className="mb-4">Plan actual</h4>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="bg-emerald-500" shape="circle" icon={<PiLightningFill />} />
                        <div>
                            <div className="flex items-center gap-2">
                                <h6 className="font-bold">{datos.planActual.plan}</h6>
                                <Tag className="bg-success-subtle text-success rounded-md border-0">
                                    <span className="capitalize">{datos.planActual.estado}</span>
                                </Tag>
                            </div>
                            <div className="font-semibold">
                                <span>Facturación {datos.planActual.cicloFacturacion}</span>
                                <span> | </span>
                                <span>Siguiente pago el {dayjs.unix(datos.planActual.proximoPago ?? 0).format('DD/MM/YYYY')}</span>
                                <span className="mx-1">por</span>
                                <NumericFormat className="font-bold heading-text" displayType="text" value={(Math.round((datos.planActual.monto ?? 0) * 100) / 100).toFixed(2)} prefix="$" thousandSeparator />
                            </div>
                        </div>
                    </div>
                    <Button size="sm" variant="solid" onClick={() => setMostrarPlanes(true)}>Cambiar plan</Button>
                </div>
            </div>

            <div className="mt-8">
                <h5>Método de pago</h5>
                <div>
                    {datos.metodosPago.map((tarjeta, index) => (
                        <div key={tarjeta.cardId} className={classNames('flex items-center justify-between p-4', !isLastChild(datos.metodosPago, index) && 'border-b border-gray-200 dark:border-gray-600')}>
                            <div className="flex items-center">
                                {tarjeta.cardType === 'VISA'   && <img src="/img/others/img-8.png" alt="visa" />}
                                {tarjeta.cardType === 'MASTER' && <img src="/img/others/img-9.png" alt="master" />}
                                <div className="ml-3 rtl:mr-3">
                                    <div className="flex items-center">
                                        <div className="text-gray-900 dark:text-gray-100 font-semibold">{tarjeta.cardHolderName} •••• {tarjeta.last4Number}</div>
                                        {tarjeta.primary && <Tag className="bg-primary-subtle text-primary rounded-md border-0 mx-2">Principal</Tag>}
                                    </div>
                                    <span>Vence {mesesAbrev[parseInt(tarjeta.expMonth) - 1]} 20{tarjeta.expYear}</span>
                                </div>
                            </div>
                            <Button size="sm" type="button">Editar</Button>
                        </div>
                    ))}
                    <Button variant="plain" icon={<TbPlus />}>Agregar método de pago</Button>
                </div>
            </div>

            <div className="mt-8">
                <h5 className="mb-4">Historial de transacciones</h5>
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold">Fecha</th>
                                <th className="text-left px-4 py-3 font-semibold">Descripción</th>
                                <th className="text-left px-4 py-3 font-semibold">Monto</th>
                                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datos.historialTransacciones.map((tx, index) => (
                                <tr key={tx.id} className={classNames(!isLastChild(datos.historialTransacciones, index) && 'border-b border-gray-200 dark:border-gray-600')}>
                                    <td className="px-4 py-3">{dayjs.unix(tx.fecha).format('DD/MM/YYYY')}</td>
                                    <td className="px-4 py-3">{tx.descripcion}</td>
                                    <td className="px-4 py-3"><NumericFormat displayType="text" value={tx.monto.toFixed(2)} prefix="$" thousandSeparator /></td>
                                    <td className="px-4 py-3"><Tag className="bg-success-subtle text-success rounded-md border-0">{tx.estado}</Tag></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default VistaFacturacion