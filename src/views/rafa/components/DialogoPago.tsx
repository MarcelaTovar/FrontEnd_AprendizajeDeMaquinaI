import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Segment from '@/components/ui/Segment'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import { TbCheck, TbCreditCard, TbMail } from 'react-icons/tb'
import { NumericFormat, PatternFormat, NumberFormatBase } from 'react-number-format'
import { usePricingStore } from '../store/pricingStore'
import { useSettingsStore } from '../store/settingsStore'
import { cardExpiryFormat } from '../constants'
import type { CiclosPago } from '../types'

const DialogoPago = () => {
    const [cargando, setCargando] = useState(false)
    const [pagoExitoso, setPagoExitoso] = useState(false)

    const { setVistaActual } = useSettingsStore()
    const { dialogoPago, setDialogoPago, planSeleccionado, setPlanSeleccionado } = usePricingStore()

    const cerrarDialogo = async () => {
        setDialogoPago(false)
        await sleep(200)
        setPlanSeleccionado({})
        setPagoExitoso(false)
    }

    const handleCambioCiclo = (ciclo: CiclosPago) => {
        setPlanSeleccionado({ ...planSeleccionado, ciclopago: ciclo })
    }

    const handlePagar = async () => {
        setCargando(true)
        await sleep(500)
        setCargando(false)
        setPagoExitoso(true)
    }

    const irAFacturacion = async () => {
        setVistaActual('facturacion')
        await cerrarDialogo()
    }

    return (
        <Dialog isOpen={dialogoPago} closable={!pagoExitoso} onClose={cerrarDialogo} onRequestClose={cerrarDialogo}>
            {pagoExitoso ? (
                <div className="text-center mt-6 mb-2">
                    <div className="inline-flex rounded-full p-5 bg-success">
                        <TbCheck className="text-5xl text-white" />
                    </div>
                    <div className="mt-6">
                        <h4>¡Gracias por tu compra!</h4>
                        <p className="text-base max-w-[400px] mx-auto mt-4 leading-relaxed">
                            Hemos recibido tu pedido y lo estamos procesando. Recibirás un correo con los detalles pronto.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-8">
                        <Button block onClick={irAFacturacion}>Ver suscripción</Button>
                        <Button block variant="solid" onClick={cerrarDialogo}>Cerrar</Button>
                    </div>
                </div>
            ) : (
                <>
                    <h4>Plan {planSeleccionado.nombrePlan}</h4>
                    <div className="mt-6">
                        <Segment
                            defaultValue={planSeleccionado.ciclopago}
                            className="gap-4 flex bg-transparent"
                            onChange={(value) => handleCambioCiclo(value as CiclosPago)}
                        >
                            {Object.entries(planSeleccionado.precio || {}).map(([key, value]) => (
                                <Segment.Item key={key} value={key}>
                                    {({ active, onSegmentItemClick }) => (
                                        <div
                                            className={classNames(
                                                'flex justify-between border rounded-xl border-gray-300 py-5 px-4 select-none ring-1 w-1/2',
                                                active ? 'ring-primary border-primary' : 'ring-transparent bg-gray-100',
                                            )}
                                            role="button"
                                            onClick={onSegmentItemClick}
                                        >
                                            <div>
                                                <div className="heading-text mb-0.5">
                                                    Pagar {key === 'mensual' ? 'mensualmente' : 'anualmente'}
                                                </div>
                                                <span className="text-lg font-bold heading-text flex gap-0.5">
                                                    <NumericFormat displayType="text" value={value as number} prefix="$" thousandSeparator />
                                                    <span>/</span>
                                                    <span>{key === 'mensual' ? 'mes' : 'año'}</span>
                                                </span>
                                            </div>
                                            {active && <TbCheck className="text-primary text-xl" />}
                                        </div>
                                    )}
                                </Segment.Item>
                            ))}
                        </Segment>
                    </div>
                    <div className="mt-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                            <div className="w-full">
                                <span>Correo de facturación</span>
                                <div className="flex items-center gap-2 mt-2">
                                    <TbMail className="text-2xl" />
                                    <input className="focus:outline-none heading-text flex-1" placeholder="Ingresa tu correo" type="email" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <div className="w-full">
                                <span>Tarjeta de crédito</span>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex-1"><TbCreditCard className="text-2xl" /></div>
                                    <PatternFormat className="focus:outline-none heading-text w-full" placeholder="Número de tarjeta" format="#### #### #### ####" />
                                    <NumberFormatBase className="focus:outline-none heading-text max-w-12 sm:max-w-28" placeholder="MM/AA" format={cardExpiryFormat} />
                                    <PatternFormat className="focus:outline-none heading-text max-w-12 sm:max-w-28" placeholder="CVC" format="###" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col items-end">
                        <h4>
                            <span>Total a pagar: </span>
                            <NumericFormat
                                displayType="text"
                                value={planSeleccionado.precio?.[planSeleccionado.ciclopago as CiclosPago]}
                                prefix="$"
                                thousandSeparator
                            />
                        </h4>
                        <div className="max-w-[350px] ltr:text-right rtl:text-left leading-none mt-2 opacity-80">
                            <small>Al hacer clic en "Pagar", aceptas ser cobrado según el ciclo seleccionado. Puedes cancelar en cualquier momento.</small>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button block variant="solid" loading={cargando} onClick={handlePagar}>Pagar</Button>
                    </div>
                </>
            )}
        </Dialog>
    )
}

export default DialogoPago