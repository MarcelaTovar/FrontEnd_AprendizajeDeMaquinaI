import { Suspense } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { useSettingsStore } from './configuracion/store/settingsStore'
import MenuLateral from './configuracion/components/MenuLateral'
import VistaPerfil from './configuracion/components/VistaPerfil'
import VistaFacturacion from './configuracion/components/VistaFacturacion'
import VistaTema from './configuracion/components/VistaTema'
import VistaPersonalizacion from './configuracion/components/VistaPersonalizacion' 

const Settings = () => {
    const { vistaActual } = useSettingsStore()

    return (
        <AdaptiveCard className="h-full">
            <div className="flex flex-auto h-full">
                <MenuLateral />
                <div className="ltr:xl:pl-6 rtl:xl:pr-6 flex-1 py-2">
                    <Suspense fallback={<></>}>
                        {vistaActual === 'perfil'      && <VistaPerfil />}
                        {vistaActual === 'facturacion' && <VistaFacturacion />}
                        {vistaActual === 'tema'        && <VistaTema />}
                        {vistaActual === 'personalizacion' && <VistaPersonalizacion />}
                    </Suspense>
                </div>
            </div>
        </AdaptiveCard>
    )
}

export default Settings