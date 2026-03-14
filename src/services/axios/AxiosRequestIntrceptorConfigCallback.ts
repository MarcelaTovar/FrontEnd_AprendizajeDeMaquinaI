import appConfig from '@/configs/app.config'
import {
    TOKEN_TYPE,
    REQUEST_HEADER_AUTH_KEY,
    TOKEN_NAME_IN_STORAGE,
} from '@/constants/api.constant'
import cookiesStorage from '@/utils/cookiesStorage'
import type { InternalAxiosRequestConfig } from 'axios'

const AxiosRequestIntrceptorConfigCallback = (
    config: InternalAxiosRequestConfig,
) => {
    const storage = appConfig.accessTokenPersistStrategy

    let accessToken = ''

    if (storage === 'localStorage') {
        accessToken = localStorage.getItem(TOKEN_NAME_IN_STORAGE) || ''
    }

    if (storage === 'sessionStorage') {
        accessToken = sessionStorage.getItem(TOKEN_NAME_IN_STORAGE) || ''
    }

    if (storage === 'cookies') {
        accessToken = cookiesStorage.getItem(TOKEN_NAME_IN_STORAGE) || ''
    }

    // No agregar token en login ni registro
    const url = config.url || ''
    const isAuthRoute = url.includes('sign-in') || url.includes('login') || url.includes('register')
    if (accessToken && !isAuthRoute) {
        config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`
    }

    return config
}

export default AxiosRequestIntrceptorConfigCallback
