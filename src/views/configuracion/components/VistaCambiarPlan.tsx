import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Segment from '@/components/ui/Segment'
import { TbCheck } from 'react-icons/tb'
import { NumericFormat } from 'react-number-format'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import { usePricingStore } from '../store/pricingStore'
import { planesDisponibles, listaCaracteristicas } from '../constants'
import DialogoPago from './DialogoPago'
import type { CiclosPago } from '../types'

type Props = { onVolver: () => void }

const VistaCambiarPlan = ({ onVolver }: Props) => {
    const { ciclopago, setCicloPago, setDialogoPago, setPlanSeleccionado } = usePricingStore()

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Button size="sm" onClick={onVolver}>← Volver</Button>
                <h4 className="mb-0">Cambiar plan</h4>
            </div>

            <div className="flex justify-center mb-8">
                <Segment value={ciclopago} onChange={(val) => setCicloPago(val as CiclosPago)}>
                    <Segment.Item value="mensual">Mensual</Segment.Item>
                    <Segment.Item value="anual">Anual</Segment.Item>
                </Segment>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-4">
                {planesDisponibles.map((plan, index) => (
                    <div
                        key={plan.id}
                        className={classNames(
                            'px-6 pt-2 flex flex-col justify-between',
                            !isLastChild(planesDisponibles, index) &&
                                'border-r-0 xl:border-r border-gray-200 dark:border-gray-700',
                        )}
                    >
                        <div>
                            <h5 className="mb-6 flex items-center gap-2">
                                <span>{plan.nombre}</span>
                                {plan.recomendado && (
                                    <Tag className="rounded-full bg-green-200 font-bold">
                                        Recomendado
                                    </Tag>
                                )}
                            </h5>

                            <div>{plan.descripcion}</div>

                            <div className="mt-6">
                                {plan.precio.mensual === 0 ? (
                                    <span className="h1">Gratis</span>
                                ) : (
                                    <>
                                        <NumericFormat
                                            className="h1"
                                            displayType="text"
                                            value={plan.precio[ciclopago]}
                                            prefix="$"
                                            thousandSeparator
                                        />
                                        <span className="text-lg font-bold">
                                            {' '}/ {ciclopago === 'mensual' ? 'mes' : 'año'}
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                                {listaCaracteristicas
                                    .filter((c) => plan.caracteristicas.includes(c.id))
                                    .map((c) => (
                                        <div
                                            key={c.id}
                                            className="flex items-center gap-4 font-semibold heading-text"
                                        >
                                            <TbCheck className="text-2xl text-primary shrink-0" />
                                            <span>{c.descripcion}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="mt-10">
                            <Button
                                block
                                onClick={() => {
                                    if (plan.precio.mensual === 0) return
                                    setPlanSeleccionado({
                                        ciclopago,
                                        nombrePlan: plan.nombre,
                                        precio: plan.precio,
                                    })
                                    setDialogoPago(true)
                                }}
                            >
                                {plan.precio.mensual === 0 ? 'Plan actual' : 'Seleccionar plan'}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <DialogoPago />
        </div>
    )
}

export default VistaCambiarPlan