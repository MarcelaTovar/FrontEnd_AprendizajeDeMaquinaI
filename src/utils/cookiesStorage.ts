import Cookies from 'js-cookie'

type StateStorage = {
    getItem: (name: string) => string | null
    setItem: (name: string, value: string) => void
    removeItem: (name: string) => void
}

const cookiesStorage: StateStorage = {
    getItem: (name: string) => {
        return Cookies.get(name) ?? null
    },
    setItem: (name: string, value: string) => {
        Cookies.set(name, value)
    },
    removeItem: (name: string) => {
        Cookies.remove(name)
    },
}

export default cookiesStorage
