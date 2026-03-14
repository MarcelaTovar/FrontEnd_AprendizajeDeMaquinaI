import ModeSwitcher from './ModeSwitcher'
import LayoutSwitcher from './LayoutSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import DirectionSwitcher from './DirectionSwitcher'
import CopyButton from './CopyButton'

export type ThemeConfiguratorProps = {
    callBackClose?: () => void
}

const ThemeConfigurator = ({ callBackClose }: ThemeConfiguratorProps) => {
    return (
        <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col gap-y-10 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h6>Modo oscuro</h6>
                        <span>Cambiar tema a modo oscuro</span>
                    </div>
                    <ModeSwitcher />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h6>Dirección</h6>
                        <span>Selecciona una dirección</span>
                    </div>
                    <DirectionSwitcher callBackClose={callBackClose} />
                </div>
                <div>
                    <h6 className="mb-3">Tema</h6>
                    <ThemeSwitcher />
                </div>
                <div>
                    <h6 className="mb-3">Diseño</h6>
                    <LayoutSwitcher />
                </div>
            </div>
            <CopyButton />
        </div>
    )
}

export default ThemeConfigurator
