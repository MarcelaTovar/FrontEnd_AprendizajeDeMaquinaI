import { Suspense } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { useSettingsStore } from './rafa/store/settingsStore'
import MenuLateral from './rafa/components/MenuLateral'
import VistaPerfil from './rafa/components/VistaPerfil'
import VistaFacturacion from './rafa/components/VistaFacturacion'
import VistaTema from './rafa/components/VistaTema'

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
                    </Suspense>
                </div>
            </div>
        </AdaptiveCard>
    )
}

export default Settings