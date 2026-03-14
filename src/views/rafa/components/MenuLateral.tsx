import { TbPalette, TbUser, TbCreditCard } from 'react-icons/tb'
import { useSettingsStore } from '../store/settingsStore'
import useResponsive from '@/utils/hooks/useResponsive'
import type { Vista } from '../types'

const itemsMenu = [
    { key: 'perfil',      label: 'Perfil',      icon: <TbUser size={18} /> },
    { key: 'facturacion', label: 'Facturación', icon: <TbCreditCard size={18} /> },
    { key: 'tema',        label: 'Tema',        icon: <TbPalette size={18} /> },
] as const

const MenuLateral = () => {
    const { vistaActual, setVistaActual } = useSettingsStore()
    const { smaller, larger } = useResponsive()

    return (
        <>
            {larger.lg && (
                <div className="w-[200px] xl:w-[280px] border-r border-gray-200 dark:border-gray-700 pr-4">
                    <h5 className="mb-6 font-semibold">Configuración</h5>
                    <nav className="flex flex-col gap-1">
                        {itemsMenu.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setVistaActual(item.key)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left
                                    ${vistaActual === item.key
                                        ? 'bg-primary text-white font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            )}
            {smaller.lg && (
                <div className="mb-6 w-full">
                    <select
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800"
                        value={vistaActual}
                        onChange={(e) => setVistaActual(e.target.value as Vista)}
                    >
                        {itemsMenu.map((item) => (
                            <option key={item.key} value={item.key}>{item.label}</option>
                        ))}
                    </select>
                </div>
            )}
        </>
    )
}

export default MenuLateral