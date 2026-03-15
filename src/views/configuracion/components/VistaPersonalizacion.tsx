import { useState } from 'react'
import Button from '@/components/ui/Button'
import Switcher from '@/components/ui/Switcher'
import Radio from '@/components/ui/Radio'
import Input from '@/components/ui/Input'
import Tabs from '@/components/ui/Tabs'
import { usePersonalizacionStore } from '../store/personalizacionStore'
import type { EstiloRespuesta, TonoRespuesta } from '../store/personalizacionStore'

const { TabNav, TabList, TabContent } = Tabs

// ─── Estilo y Tono ────────────────────────────────────────────────────────────

const SeccionEstiloTono = () => {
    const {
        estiloRespuesta, tonoRespuesta,
        setEstiloRespuesta, setTonoRespuesta,
    } = usePersonalizacionStore()

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h6 className="mb-1">Estilo de respuesta</h6>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Define cómo debe expresarse el asistente al responderte.
                </p>
                <Radio.Group
                    value={estiloRespuesta}
                    onChange={(val) => setEstiloRespuesta(val as EstiloRespuesta)}
                >
                    <div className="flex flex-col gap-3">
                        <Radio value="formal">
                            <div>
                                <div className="font-semibold">Formal</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Lenguaje técnico y profesional, ideal para entornos clínicos.
                                </div>
                            </div>
                        </Radio>
                        <Radio value="neutral">
                            <div>
                                <div className="font-semibold">Neutral</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Balance entre claridad y precisión médica.
                                </div>
                            </div>
                        </Radio>
                        <Radio value="casual">
                            <div>
                                <div className="font-semibold">Casual</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Lenguaje accesible, ideal para pacientes o estudiantes.
                                </div>
                            </div>
                        </Radio>
                    </div>
                </Radio.Group>
            </div>

            <div>
                <h6 className="mb-1">Tono de respuesta</h6>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Controla la profundidad y extensión de las respuestas del asistente.
                </p>
                <Radio.Group
                    value={tonoRespuesta}
                    onChange={(val) => setTonoRespuesta(val as TonoRespuesta)}
                >
                    <div className="flex flex-col gap-3">
                        <Radio value="conciso">
                            <div>
                                <div className="font-semibold">Conciso</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Respuestas breves y directas al punto.
                                </div>
                            </div>
                        </Radio>
                        <Radio value="detallado">
                            <div>
                                <div className="font-semibold">Detallado</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Respuestas completas con contexto y explicaciones.
                                </div>
                            </div>
                        </Radio>
                        <Radio value="educativo">
                            <div>
                                <div className="font-semibold">Educativo</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Incluye explicaciones didácticas y referencias cuando es posible.
                                </div>
                            </div>
                        </Radio>
                    </div>
                </Radio.Group>
            </div>
        </div>
    )
}

// ─── Instrucciones personalizadas ─────────────────────────────────────────────

const SeccionInstrucciones = () => {
    const {
        instruccionSistema, instruccionUsuario,
        setInstruccionSistema, setInstruccionUsuario,
    } = usePersonalizacionStore()

    const [sistemaLocal, setSistemaLocal] = useState(instruccionSistema)
    const [usuarioLocal, setUsuarioLocal] = useState(instruccionUsuario)
    const [guardado, setGuardado] = useState(false)

    const handleGuardar = () => {
        setInstruccionSistema(sistemaLocal)
        setInstruccionUsuario(usuarioLocal)
        setGuardado(true)
        setTimeout(() => setGuardado(false), 2000)
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h6 className="mb-1">Instrucción de sistema</h6>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Define el comportamiento base del asistente. Por ejemplo: su rol, especialidad o restricciones.
                </p>
                <Input
                    rows={4}
                    placeholder="Ej: Eres Dr. Nefros, un asistente especializado en nefrología basado en Harrison's..."
                    value={sistemaLocal}
                    onChange={(e) => setSistemaLocal(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{sistemaLocal.length} / 1000 caracteres</p>
            </div>

            <div>
                <h6 className="mb-1">Instrucción de usuario</h6>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Indica preferencias personales que el asistente debe tener en cuenta en cada respuesta.
                </p>
                <Input
                    rows={4}
                    placeholder="Ej: Siempre cita la fuente del capítulo de Harrison's al final de cada respuesta..."
                    value={usuarioLocal}
                    onChange={(e) => setUsuarioLocal(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{usuarioLocal.length} / 1000 caracteres</p>
            </div>

            <div className="flex justify-end">
                <Button
                    variant="solid"
                    onClick={handleGuardar}
                >
                    {guardado ? '¡Guardado!' : 'Guardar instrucciones'}
                </Button>
            </div>
        </div>
    )
}

// ─── Memoria ──────────────────────────────────────────────────────────────────

const SeccionMemoria = () => {
    const {
        memoriaActiva, historialActivo,
        setMemoriaActiva, setHistorialActivo,
    } = usePersonalizacionStore()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                    <h6 className="mb-1">Memoria del asistente</h6>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Permite que el asistente recuerde información relevante de conversaciones anteriores,
                        como preferencias, contexto clínico o datos frecuentes del usuario.
                    </p>
                    {memoriaActiva && (
                        <p className="text-xs text-primary mt-2 font-medium">
                            ✓ El asistente usará memoria guardada en tus próximas consultas.
                        </p>
                    )}
                </div>
                <div className="pt-1 shrink-0">
                    <Switcher
                        checked={memoriaActiva}
                        onChange={(val) => setMemoriaActiva(val)}
                    />
                </div>
            </div>

            <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                    <h6 className="mb-1">Historial de chats</h6>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Utiliza el historial de conversaciones previas como contexto adicional
                        para el sistema RAG, mejorando la relevancia de las respuestas.
                    </p>
                    {historialActivo && (
                        <p className="text-xs text-primary mt-2 font-medium">
                            ✓ El historial de chats se incluirá como contexto en las búsquedas.
                        </p>
                    )}
                </div>
                <div className="pt-1 shrink-0">
                    <Switcher
                        checked={historialActivo}
                        onChange={(val) => setHistorialActivo(val)}
                    />
                </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <h6 className="mb-2 text-sm font-semibold">Estado actual del contexto RAG</h6>
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${memoriaActiva ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        <span className="text-gray-600 dark:text-gray-400">
                            Memoria: <span className="font-medium">{memoriaActiva ? 'Activada' : 'Desactivada'}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${historialActivo ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        <span className="text-gray-600 dark:text-gray-400">
                            Historial de chats: <span className="font-medium">{historialActivo ? 'Activado' : 'Desactivado'}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Vista principal ──────────────────────────────────────────────────────────

const VistaPersonalizacion = () => {
    return (
        <div>
            <h4 className="mb-2">Personalización</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Ajusta el comportamiento del asistente según tus necesidades.
            </p>
            <Tabs defaultValue="estilo">
                <TabList>
                    <TabNav value="estilo">Estilo y Tono</TabNav>
                    <TabNav value="instrucciones">Instrucciones</TabNav>
                    <TabNav value="memoria">Memoria</TabNav>
                </TabList>
                <div className="mt-6">
                    <TabContent value="estilo">
                        <SeccionEstiloTono />
                    </TabContent>
                    <TabContent value="instrucciones">
                        <SeccionInstrucciones />
                    </TabContent>
                    <TabContent value="memoria">
                        <SeccionMemoria />
                    </TabContent>
                </div>
            </Tabs>
        </div>
    )
}

export default VistaPersonalizacion